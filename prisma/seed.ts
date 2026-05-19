import { ContactConfidence, PrismaClient, ReportStatus, Severity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@fixlocal.ai" },
    update: { name: "Demo User", isDemo: true },
    create: {
      email: "demo@fixlocal.ai",
      name: "Demo User",
      isDemo: true
    }
  });

  await prisma.subscriptionPlan.upsert({
    where: { slug: "pro_monthly" },
    update: {
      priceCents: 499,
      interval: "month",
      reportLimit: null
    },
    create: {
      slug: "pro_monthly",
      name: "Monthly Pro",
      priceCents: 499,
      interval: "month",
      reportLimit: null,
      features: ["Unlimited reports", "PDF export", "Report history", "Saved contacts"]
    }
  });

  await prisma.subscriptionPlan.upsert({
    where: { slug: "pro_annual" },
    update: {
      priceCents: 2999,
      interval: "year",
      reportLimit: null
    },
    create: {
      slug: "pro_annual",
      name: "Annual Pro",
      priceCents: 2999,
      interval: "year",
      reportLimit: null,
      features: ["Unlimited reports", "PDF export", "Report history", "Saved contacts"]
    }
  });

  for (const category of [
    "Pothole",
    "Broken sidewalk",
    "Trash or illegal dumping",
    "Unsafe rental condition",
    "Mold",
    "Broken streetlight",
    "Drainage or flooding",
    "Damaged sign",
    "Unsafe wiring",
    "Unsafe building",
    "Downed tree",
    "Power line or utility hazard",
    "Water leak",
    "Water damage",
    "HOA issue",
    "Other local problem"
  ]) {
    await prisma.issueCategory.upsert({
      where: { slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: { label: category },
      create: {
        slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: category,
        responsibleDepartments: []
      }
    });
  }

  const sampleSource =
    (await prisma.contactSource.findFirst({
      where: { name: "ReportRight sample contact data (not verified)" }
    })) ??
    (await prisma.contactSource.create({
      data: {
        name: "ReportRight sample contact data (not verified)",
        url: "https://github.com/monaghanhc/FixLocal_Website",
        notes:
          "Sample local routing records for development and tests. These are not verified official contacts and must be replaced or confirmed before production use."
      }
    }));

  const sampleJurisdictions = [
    { city: "Mount Pleasant", county: "Charleston", state: "SC", zipCode: null },
    { city: "Charleston", county: "Charleston", state: "SC", zipCode: null },
    { city: "North Charleston", county: "Charleston", state: "SC", zipCode: null },
    { city: "Charleston County", county: "Charleston", state: "SC", zipCode: null },
    { city: "Statewide", county: null, state: "SC", zipCode: null }
  ];

  const jurisdictionByKey = new Map<string, string>();
  for (const jurisdiction of sampleJurisdictions) {
    const existing = await prisma.jurisdiction.findFirst({
      where: {
        city: jurisdiction.city,
        county: jurisdiction.county,
        state: jurisdiction.state
      }
    });
    const saved =
      existing ??
      (await prisma.jurisdiction.create({
        data: {
          ...jurisdiction,
          country: "US",
          source: "ReportRight sample contact data (not verified)",
          sourceLastVerifiedAt: null
        }
      }));
    jurisdictionByKey.set(`${jurisdiction.city}|${jurisdiction.county ?? ""}|${jurisdiction.state}`, saved.id);
  }

  const sampleContacts = [
    {
      key: "Mount Pleasant|Charleston|SC",
      categorySlug: "pothole",
      name: "Mount Pleasant Public Services Sample Contact",
      organization: "Town of Mount Pleasant, SC",
      department: "Public Services / Streets",
      type: "City Public Works",
      website:
        "https://www.google.com/search?q=official+Mount+Pleasant+SC+public+services+pothole+contact",
      reasonForRecommendation:
        "Potholes on town-maintained roads are typically routed to public services or streets staff."
    },
    {
      key: "Charleston|Charleston|SC",
      categorySlug: "mold",
      name: "Charleston Housing or Livability Sample Contact",
      organization: "City of Charleston, SC",
      department: "Housing, Livability, or Code Enforcement",
      type: "Code Enforcement",
      website:
        "https://www.google.com/search?q=official+Charleston+SC+code+enforcement+housing+mold+contact",
      reasonForRecommendation:
        "Unresolved rental mold concerns may need landlord, property manager, housing, or code enforcement review."
    },
    {
      key: "Charleston County|Charleston|SC",
      categorySlug: "trash-or-illegal-dumping",
      name: "Charleston County Solid Waste Sample Contact",
      organization: "Charleston County, SC",
      department: "Solid Waste or Environmental Management",
      type: "Sanitation Department",
      website:
        "https://www.google.com/search?q=official+Charleston+County+SC+illegal+dumping+solid+waste+contact",
      reasonForRecommendation:
        "Illegal dumping outside city-maintained areas is often routed to county solid waste, sanitation, or code staff."
    },
    {
      key: "North Charleston|Charleston|SC",
      categorySlug: "unsafe-building",
      name: "North Charleston Code Enforcement Sample Contact",
      organization: "City of North Charleston, SC",
      department: "Code Enforcement or Building Inspections",
      type: "Code Enforcement",
      website:
        "https://www.google.com/search?q=official+North+Charleston+SC+code+enforcement+building+inspection+contact",
      reasonForRecommendation:
        "Unsafe building conditions are commonly reviewed by code enforcement or building inspections."
    },
    {
      key: "Charleston|Charleston|SC",
      categorySlug: "drainage-or-flooding",
      name: "Charleston Stormwater Sample Contact",
      organization: "City of Charleston, SC",
      department: "Stormwater or Public Works",
      type: "Stormwater Department",
      website:
        "https://www.google.com/search?q=official+Charleston+SC+stormwater+flooding+drainage+contact",
      reasonForRecommendation:
        "Drainage, flooding, blocked drains, and runoff issues are commonly routed to stormwater or public works staff."
    },
    {
      key: "Statewide||SC",
      categorySlug: "pothole",
      name: "SCDOT State-Maintained Road Sample Contact",
      organization: "South Carolina Department of Transportation",
      department: "Maintenance / State DOT",
      type: "Department of Transportation",
      website:
        "https://www.google.com/search?q=official+SCDOT+pothole+road+maintenance+contact",
      reasonForRecommendation:
        "A state DOT may handle potholes on state-maintained routes or highways."
    }
  ];

  for (const contact of sampleContacts) {
    const existing = await prisma.contact.findFirst({
      where: {
        name: contact.name,
        organization: contact.organization
      }
    });
    const data = {
      jurisdictionId: jurisdictionByKey.get(contact.key),
      sourceId: sampleSource.id,
      categorySlug: contact.categorySlug,
      name: contact.name,
      organization: contact.organization,
      department: contact.department,
      type: contact.type,
      email: null,
      phone: null,
      website: contact.website,
      confidence: ContactConfidence.LOW,
      reasonForRecommendation: `${contact.reasonForRecommendation} Sample data only; verify the official contact before sending.`,
      active: true
    };

    if (existing) {
      await prisma.contact.update({ where: { id: existing.id }, data });
    } else {
      await prisma.contact.create({ data });
    }
  }

  await prisma.report.deleteMany({ where: { userId: demoUser.id } });
  await prisma.usageCounter.deleteMany({ where: { userId: demoUser.id } });

  const reports = [
    {
      title: "Deep pothole near Pine and 8th",
      description:
        "Large pothole in the eastbound lane. Cars are swerving and it looks deep enough to damage tires.",
      category: "Pothole",
      address: "801 Pine Street",
      city: "Riverton",
      state: "OH",
      zip: "43001",
      dateObserved: new Date("2026-04-28"),
      urgent: false,
      optionalNotes: "Worst after rain because water hides the depth.",
      status: ReportStatus.WAITING_RESPONSE,
      severity: Severity.HIGH,
      detectedIssueType: "Road surface hazard",
      confidenceScore: 0.88,
      suggestedResponsibleParty: "City Public Works",
      missingDetails: ["Approximate pothole diameter", "Nearest cross street or lane marker"],
      formalEmail:
        "Subject: Request for repair - deep pothole near 801 Pine Street\n\nHello,\n\nI am reporting a deep pothole near 801 Pine Street in Riverton, OH 43001. The damaged pavement is causing vehicles to swerve and may damage tires or create a collision risk.\n\nThe issue was observed on April 28, 2026. A photo is available for reference. Please inspect the location and schedule repair as soon as practical.\n\nThank you,\nDemo User",
      smsMessage:
        "Reporting a deep pothole near 801 Pine Street, Riverton, OH. Cars are swerving and tire damage is likely. Observed Apr 28, 2026. Photo available.",
      printableReport:
        "Road hazard report for 801 Pine Street, Riverton, OH 43001. A deep pothole is present in the eastbound lane and appears severe enough to damage vehicles. Requested action: inspect and repair pavement.",
      followUpMessage:
        "Hello, I am following up on my pothole report near 801 Pine Street. Could you share whether inspection or repair has been scheduled?"
    },
    {
      title: "Possible mold under bathroom sink",
      description:
        "Dark mold-like growth under the bathroom sink with a musty smell. The cabinet wall is soft and there may be a leak.",
      category: "Mold",
      address: "1200 Maple Avenue Apt 3B",
      city: "Riverton",
      state: "OH",
      zip: "43001",
      dateObserved: new Date("2026-04-26"),
      urgent: true,
      optionalNotes: "Tenant has already notified the landlord by text.",
      status: ReportStatus.NEEDS_FOLLOW_UP,
      severity: Severity.URGENT,
      detectedIssueType: "Indoor moisture and possible mold",
      confidenceScore: 0.84,
      suggestedResponsibleParty: "Property Manager",
      missingDetails: ["How long the leak has been present", "Whether anyone has symptoms"],
      formalEmail:
        "Subject: Urgent repair request - possible mold and leak at 1200 Maple Avenue Apt 3B\n\nHello,\n\nI am requesting inspection and repair for possible mold and water damage under the bathroom sink at 1200 Maple Avenue Apt 3B in Riverton, OH 43001. The cabinet has a musty odor, visible dark growth, and soft material that may indicate an active leak.\n\nThe issue was observed on April 26, 2026. Please arrange inspection, leak repair, and appropriate remediation. A photo is available for review.\n\nThank you,\nDemo User",
      smsMessage:
        "Urgent: possible mold/water damage under bathroom sink at 1200 Maple Ave Apt 3B, Riverton. Musty odor, soft cabinet wall, possible leak. Photo available.",
      printableReport:
        "Housing condition report for 1200 Maple Avenue Apt 3B. Possible mold and water damage observed under bathroom sink. Requested action: inspect, repair leak, and remediate affected materials.",
      followUpMessage:
        "Hello, I am following up on the possible mold and leak reported at 1200 Maple Avenue Apt 3B. Please confirm the repair timeline and next inspection step."
    }
  ];

  for (const report of reports) {
    const created = await prisma.report.create({
      data: {
        ...report,
        userId: demoUser.id,
        contacts: {
          create: [
            {
              name:
                report.category === "Mold"
                  ? "Verified Property Manager or Landlord"
                  : "Riverton Public Works Official Lookup",
              type:
                report.category === "Mold" ? "Property Manager" : "City Public Works",
              email: null,
              phone: null,
              website:
                report.category === "Mold"
                  ? "https://www.google.com/search?q=property%20manager%20maintenance%201200%20Maple%20Avenue%20Riverton%20OH%20phone%20email"
                  : "https://www.google.com/search?q=official%20Riverton%20OH%20Public%20Works%20contact%20phone%20email",
              lookupUrl:
                report.category === "Mold"
                  ? "https://www.google.com/search?q=property%20manager%20maintenance%201200%20Maple%20Avenue%20Riverton%20OH%20phone%20email"
                  : "https://www.google.com/search?q=official%20Riverton%20OH%20Public%20Works%20contact%20phone%20email",
              verificationNote:
                "Demo data does not include unverified contact details. Open the official lookup and confirm the current email or phone number before sending.",
              reason:
                report.category === "Mold"
                  ? "Rental habitability issues should first be reported to the property manager, with code enforcement as a backup."
                  : "Potholes and road surface hazards are typically handled by Public Works or transportation staff."
            },
            {
              name: "Riverton Code Enforcement Official Lookup",
              type: "Code Enforcement",
              email: null,
              phone: null,
              website:
                "https://www.google.com/search?q=official%20Riverton%20OH%20Code%20Enforcement%20contact%20phone%20email",
              lookupUrl:
                "https://www.google.com/search?q=official%20Riverton%20OH%20Code%20Enforcement%20contact%20phone%20email",
              verificationNote:
                "Use the official city or county contact page to verify the current phone number or email address.",
              reason: "Useful if the condition is not corrected or creates an ongoing safety concern."
            }
          ]
        },
        statusHistory: {
          create: [
            { status: ReportStatus.DRAFT, note: "Demo report created." },
            { status: report.status, note: "Sample status for the dashboard." }
          ]
        }
      }
    });

    console.log(`Seeded report ${created.title}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
