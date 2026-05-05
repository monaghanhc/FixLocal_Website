import { PrismaClient, ReportStatus, Severity } from "@prisma/client";

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

  await prisma.report.deleteMany({ where: { userId: demoUser.id } });

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
