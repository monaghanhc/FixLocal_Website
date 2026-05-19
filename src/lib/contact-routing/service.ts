import { issueCategories } from "@/lib/constants";
import type {
  ContactRoutingInput,
  ContactRoutingResult,
  RoutedContact,
  RoutingConfidence,
  VerifiedContactRecord
} from "./types";
import { verifiedContactDirectory } from "./verifiedDirectory";

const emergencySignals = [
  "fire",
  "sparking",
  "spark",
  "downed wire",
  "downed power",
  "power line",
  "gas smell",
  "collapse",
  "trapped",
  "electrocution",
  "immediate danger",
  "injury",
  "injured",
  "exposed wire",
  "live wire"
];

const categoryDepartments: Record<string, Array<{ type: string; department: string; reason: string }>> = {
  Pothole: [
    {
      type: "City Public Works",
      department: "Public Works or Streets Department",
      reason: "Potholes on local roads are commonly handled by Public Works or a streets department."
    },
    {
      type: "Department of Transportation",
      department: "County or State DOT",
      reason: "A county or state DOT may handle major corridors, highways, or roads outside city maintenance."
    }
  ],
  "Broken sidewalk": [
    {
      type: "City Public Works",
      department: "Sidewalk or Streets Maintenance",
      reason: "Sidewalk hazards are commonly triaged by Public Works."
    },
    {
      type: "Code Enforcement",
      department: "Code Enforcement",
      reason: "Some sidewalk repairs are routed to adjacent property-owner compliance."
    }
  ],
  "Broken streetlight": [
    {
      type: "Utility Company",
      department: "Streetlight Outage Team",
      reason: "Streetlight outages are often handled by the electric utility or city streetlight team."
    },
    {
      type: "City Public Works",
      department: "Public Works Streetlights",
      reason: "City-owned streetlights may route through Public Works."
    }
  ],
  "Trash or illegal dumping": [
    {
      type: "Sanitation Department",
      department: "Sanitation or Solid Waste",
      reason: "Trash and dumping reports are commonly handled by sanitation or solid waste teams."
    },
    {
      type: "Code Enforcement",
      department: "Code Enforcement",
      reason: "Code enforcement may handle recurring nuisance or private-property dumping."
    }
  ],
  "Drainage or flooding": [
    {
      type: "Stormwater Department",
      department: "Stormwater or Drainage",
      reason: "Flooding, blocked drains, and runoff issues are commonly handled by stormwater staff."
    },
    {
      type: "City Public Works",
      department: "Public Works Drainage",
      reason: "Public Works may route street flooding or blocked public infrastructure."
    }
  ],
  Mold: [
    {
      type: "Property Manager",
      department: "Property Management or Maintenance",
      reason: "Mold in a rental should usually be reported to the landlord or property manager first."
    },
    {
      type: "Housing Authority",
      department: "Housing Authority or Tenant Services",
      reason: "Housing agencies may help with habitability concerns or subsidized housing."
    },
    {
      type: "Code Enforcement",
      department: "Code Enforcement or Housing Inspection",
      reason: "Code enforcement may review unresolved unsafe housing conditions."
    }
  ],
  "Unsafe rental condition": [
    {
      type: "Property Manager",
      department: "Property Management or Maintenance",
      reason: "Rental-condition issues should usually be reported to the landlord or property manager first."
    },
    {
      type: "Housing Authority",
      department: "Housing Authority or Tenant Services",
      reason: "Housing agencies may help with habitability concerns."
    },
    {
      type: "Code Enforcement",
      department: "Code Enforcement or Housing Inspection",
      reason: "Code enforcement may review unresolved unsafe rental conditions."
    }
  ],
  "Unsafe building": [
    {
      type: "Building Inspections",
      department: "Building Inspections",
      reason: "Structural or unsafe building conditions are commonly handled by building inspections."
    },
    {
      type: "Code Enforcement",
      department: "Code Enforcement",
      reason: "Code enforcement may handle unsafe-property complaints."
    }
  ],
  "Downed tree": [
    {
      type: "City Public Works",
      department: "Public Works Forestry or Streets",
      reason: "Downed trees blocking public streets or sidewalks are commonly handled by Public Works."
    },
    {
      type: "Parks Department",
      department: "Parks or Urban Forestry",
      reason: "Trees in parks or public green space may be handled by Parks or Urban Forestry."
    },
    {
      type: "Emergency Services",
      department: "Emergency Services",
      reason: "Emergency services may be needed if the tree creates immediate danger."
    }
  ],
  "Power line or utility hazard": [
    {
      type: "Utility Company",
      department: "Electric Utility Emergency Line",
      reason: "Power line hazards should be routed to the electric utility emergency or outage team."
    },
    {
      type: "Emergency Services",
      department: "Emergency Services",
      reason: "Call emergency services if there is immediate danger, fire, injury, or a downed energized line."
    }
  ],
  "Water leak": [
    {
      type: "Water Department",
      department: "Water Utility or Water Department",
      reason: "Street or public water leaks are commonly handled by the local water utility."
    },
    {
      type: "Utility Company",
      department: "Water Utility",
      reason: "Some jurisdictions route water leaks through a utility customer service team."
    }
  ],
  "Water damage": [
    {
      type: "Property Manager",
      department: "Property Management or Maintenance",
      reason: "Water damage in a rental or managed property should usually be reported to property management first."
    },
    {
      type: "Code Enforcement",
      department: "Code Enforcement or Housing Inspection",
      reason: "Code enforcement may review unresolved unsafe water damage."
    }
  ],
  "Damaged sign": [
    {
      type: "Department of Transportation",
      department: "Traffic Signs or Transportation",
      reason: "Damaged signs are commonly handled by transportation, traffic, or streets staff."
    },
    {
      type: "City Public Works",
      department: "Public Works Signs",
      reason: "Local street signs may route through Public Works."
    }
  ],
  "Unsafe wiring": [
    {
      type: "Utility Company",
      department: "Electric Utility Emergency Line",
      reason: "Electrical utility hazards should be routed to the utility emergency or outage team."
    },
    {
      type: "Code Enforcement",
      department: "Code Enforcement or Building Inspections",
      reason: "Unsafe building wiring may require code enforcement or building inspection review."
    }
  ],
  "HOA issue": [
    {
      type: "HOA",
      department: "HOA Board or Community Manager",
      reason: "HOA issues should usually be routed to the HOA board or community manager."
    },
    {
      type: "Property Manager",
      department: "Community Property Manager",
      reason: "Managed communities often route HOA maintenance issues through a property manager."
    }
  ],
  "Other local problem": [
    {
      type: "Other",
      department: "Manual Review",
      reason: "The issue category is broad, so the recipient should be manually verified."
    }
  ]
};

function clean(value?: string | null) {
  return value?.trim() ?? "";
}

function comparable(value?: string | null) {
  return clean(value)
    .toLowerCase()
    .replace(/\bcounty\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeState(value?: string | null) {
  return clean(value).toUpperCase();
}

export function normalizeRoutingCategory(value?: string | null): string {
  const raw = clean(value).toLowerCase();
  if (!raw) return "Other local problem";
  if (raw === "flooding" || raw.includes("drain") || raw.includes("stormwater")) {
    return "Drainage or flooding";
  }
  const exact = issueCategories.find((category) => category.toLowerCase() === raw);
  if (exact) return exact;
  if (raw.includes("road surface") || raw.includes("pothole") || raw.includes("pavement")) return "Pothole";
  if (raw.includes("sidewalk") || raw.includes("walkway")) return "Broken sidewalk";
  if (raw.includes("streetlight") || raw.includes("street light") || raw.includes("light outage")) {
    return "Broken streetlight";
  }
  if (raw.includes("dump") || raw.includes("trash") || raw.includes("garbage") || raw.includes("sanitation")) {
    return "Trash or illegal dumping";
  }
  if (raw.includes("mold") || raw.includes("indoor moisture")) return "Mold";
  if (raw.includes("rental") || raw.includes("landlord") || raw.includes("habitability")) {
    return "Unsafe rental condition";
  }
  if (raw.includes("building") || raw.includes("structural")) return "Unsafe building";
  if (raw.includes("tree")) return "Downed tree";
  if (raw.includes("power") || raw.includes("wire") || raw.includes("electrical") || raw.includes("utility safety")) {
    return "Power line or utility hazard";
  }
  if (raw.includes("water leak")) return "Water leak";
  if (raw.includes("water damage") || raw.includes("water intrusion")) return "Water damage";
  if (raw.includes("sign")) return "Damaged sign";
  if (raw.includes("hoa")) return "HOA issue";
  return "Other local problem";
}

function searchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function jurisdictionLabel(input: ContactRoutingInput) {
  return [input.city, input.county ? `${clean(input.county).replace(/\s+County$/i, "")} County` : null, input.state, input.zipCode]
    .map((value) => clean(value))
    .filter(Boolean)
    .join(", ");
}

function likelyJurisdiction(input: ContactRoutingInput) {
  const city = clean(input.city);
  const county = clean(input.county).replace(/\s+County$/i, "");
  const state = normalizeState(input.state);
  if (city && state) return `${city}, ${state}`;
  if (county && state) return `${county} County, ${state}`;
  if (state) return state;
  if (input.latitude != null && input.longitude != null) return "GPS coordinates without reverse-geocoded jurisdiction";
  return "Unknown jurisdiction";
}

function isStale(sourceLastVerifiedAt: string | null) {
  if (!sourceLastVerifiedAt) return true;
  const verifiedAt = new Date(sourceLastVerifiedAt);
  if (Number.isNaN(verifiedAt.getTime())) return true;
  const now = new Date();
  const days = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24);
  return days > 365;
}

function recordSpecificity(record: VerifiedContactRecord) {
  if (record.jurisdictionLevel === "city") return 3;
  if (record.jurisdictionLevel === "county") return 2;
  return 1;
}

function matchesJurisdiction(record: VerifiedContactRecord, input: ContactRoutingInput) {
  const stateMatches = normalizeState(record.state) === normalizeState(input.state);
  if (!stateMatches) return false;
  if (record.jurisdictionLevel === "city") {
    return comparable(record.city) === comparable(input.city);
  }
  if (record.jurisdictionLevel === "county") {
    return comparable(record.county) === comparable(input.county);
  }
  return Boolean(normalizeState(input.state));
}

function directoryMatches(category: string, input: ContactRoutingInput) {
  return verifiedContactDirectory
    .filter((record) => record.category === category && matchesJurisdiction(record, input))
    .sort((a, b) => {
      const sourceRank = { "verified-exact": 3, "verified-general": 2, sample: 1 };
      return sourceRank[b.sourceKind] - sourceRank[a.sourceKind] || recordSpecificity(b) - recordSpecificity(a);
    });
}

function emergencyRequired(input: ContactRoutingInput, category: string) {
  const text = `${input.userNotes ?? ""} ${input.imageClassificationResult?.category ?? ""}`.toLowerCase();
  return (
    Boolean(input.urgent) ||
    category === "Power line or utility hazard" ||
    emergencySignals.some((signal) => text.includes(signal))
  );
}

function confidenceForRecord(record: VerifiedContactRecord): RoutingConfidence {
  if (record.sourceKind === "sample") return "LOW";
  if (isStale(record.contact.sourceLastVerifiedAt)) return "LOW";
  if (record.sourceKind === "verified-exact") return "HIGH";
  return "MEDIUM";
}

function directoryContactToRouted(record: VerifiedContactRecord): RoutedContact {
  const confidence = confidenceForRecord(record);
  const sourceQualifier =
    record.sourceKind === "sample"
      ? "Sample contact only; not verified."
      : record.sourceKind === "verified-general"
        ? "Verified jurisdiction source, but the department match is general."
        : "Verified exact category and jurisdiction source.";

  return {
    ...record.contact,
    confidence,
    reasonForRecommendation: `${sourceQualifier} ${record.contact.reason}`
  };
}

function fallbackContacts(category: string, input: ContactRoutingInput): RoutedContact[] {
  const jurisdiction = jurisdictionLabel(input) || likelyJurisdiction(input) || "your area";
  return (categoryDepartments[category] ?? categoryDepartments["Other local problem"]).map((template) => {
    const query = `official ${jurisdiction} ${template.department} contact phone email`;
    return {
      name: `${jurisdiction} ${template.department}`,
      organization: jurisdiction,
      department: template.department,
      type: template.type,
      email: null,
      phone: null,
      website: searchUrl(query),
      lookupUrl: searchUrl(query),
      source: "Official-source lookup required",
      sourceLastVerifiedAt: null,
      confidence: "LOW",
      reasonForRecommendation: template.reason,
      reason: template.reason,
      verificationNote:
        "Open the lookup link and verify the current phone/email on an official city, county, utility, landlord, property manager, or HOA page before sending."
    };
  });
}

function confidenceScoreFor(label: RoutingConfidence) {
  if (label === "HIGH") return 0.92;
  if (label === "MEDIUM") return 0.66;
  return 0.38;
}

function bestConfidence(contacts: RoutedContact[]): RoutingConfidence {
  if (contacts.some((contact) => contact.confidence === "HIGH")) return "HIGH";
  if (contacts.some((contact) => contact.confidence === "MEDIUM")) return "MEDIUM";
  return "LOW";
}

function withManualRecipient(input: ContactRoutingInput, fallbackWarnings: string[]): ContactRoutingResult | null {
  if (!input.manualRecipient) return null;
  const category = normalizeRoutingCategory(input.userSelectedCategory ?? input.imageClassificationResult?.category);
  const contact: RoutedContact = {
    ...input.manualRecipient,
    confidence: input.manualRecipient.confidence ?? "LOW",
    reasonForRecommendation:
      input.manualRecipient.reasonForRecommendation || "The user manually entered this recipient."
  };
  return {
    suggestedContacts: [contact],
    confidenceScore: confidenceScoreFor(contact.confidence),
    confidenceLabel: contact.confidence,
    issueCategory: category,
    likelyJurisdiction: likelyJurisdiction(input),
    explanation:
      "The user provided a manual recipient override. ReportRight AI still requires the user to verify the contact before continuing.",
    fallbackWarnings: [
      ...fallbackWarnings,
      "Manual recipient entered. Verify the email, phone, website, and department before sending."
    ],
    manualReviewRequired: true,
    emergencyWarningRequired: emergencyRequired(input, category)
  };
}

export function routeContact(input: ContactRoutingInput): ContactRoutingResult {
  const selectedCategory = normalizeRoutingCategory(input.userSelectedCategory);
  const imageCategory = normalizeRoutingCategory(input.imageClassificationResult?.category);
  const finalCategory =
    selectedCategory !== "Other local problem" ? selectedCategory : imageCategory || "Other local problem";
  const fallbackWarnings: string[] = [];
  const jurisdiction = likelyJurisdiction(input);

  if (!clean(input.city) && !clean(input.county)) {
    fallbackWarnings.push("City or county is required for jurisdiction-specific routing.");
  }
  if (!clean(input.state)) {
    fallbackWarnings.push("State is required for jurisdiction-specific routing.");
  }
  if (input.latitude != null && input.longitude != null && (!clean(input.city) || !clean(input.state))) {
    fallbackWarnings.push("GPS was provided, but the location still needs a readable city/state before routing.");
  }
  if (selectedCategory === "Other local problem" && imageCategory === "Other local problem") {
    fallbackWarnings.push("The issue category is broad, so manual recipient review is required.");
  }
  if ((input.imageClassificationResult?.confidenceScore ?? 1) < 0.45) {
    fallbackWarnings.push("The image classification confidence is low. Confirm or edit the category before sending.");
  }

  const manualOverride = withManualRecipient(input, fallbackWarnings);
  if (manualOverride) return manualOverride;

  const matches = directoryMatches(finalCategory, input);
  const suggestedContacts =
    matches.length > 0 ? matches.map(directoryContactToRouted) : fallbackContacts(finalCategory, input);
  const confidenceLabel = bestConfidence(suggestedContacts);

  if (matches.length === 0) {
    fallbackWarnings.push("No verified contact was found in the local directory for this jurisdiction and category.");
  }
  if (suggestedContacts.some((contact) => contact.source.includes("Sample data"))) {
    fallbackWarnings.push("One or more suggested contacts are sample data and must be verified from an official source.");
  }
  if (suggestedContacts.some((contact) => isStale(contact.sourceLastVerifiedAt))) {
    fallbackWarnings.push("One or more contact sources are missing or stale and must be verified before sending.");
  }

  const emergencyWarningRequired = emergencyRequired(input, finalCategory);
  if (emergencyWarningRequired) {
    fallbackWarnings.push("If this is an emergency or there is immediate danger, call emergency services. Do not rely on this app for emergencies.");
  }

  const confidenceScore = confidenceScoreFor(confidenceLabel);
  const manualReviewRequired = confidenceLabel !== "HIGH" || fallbackWarnings.length > 0;

  return {
    suggestedContacts: suggestedContacts.slice(0, 3),
    confidenceScore,
    confidenceLabel,
    issueCategory: finalCategory,
    likelyJurisdiction: jurisdiction,
    explanation:
      matches.length > 0
        ? `ReportRight AI matched ${finalCategory} to ${jurisdiction} using jurisdiction and category data.`
        : `ReportRight AI matched ${finalCategory} to likely departments for ${jurisdiction}, but could not verify an exact recipient.`,
    fallbackWarnings,
    manualReviewRequired,
    emergencyWarningRequired
  };
}

export const contactRoutingService = {
  route: routeContact
};
