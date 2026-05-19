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
  "downed wire",
  "downed power",
  "gas smell",
  "collapse",
  "trapped",
  "electrocution",
  "immediate danger",
  "injury",
  "injured"
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

function normalizeCategory(value?: string | null): string {
  const raw = clean(value).toLowerCase();
  if (!raw) return "Other local problem";
  if (raw === "flooding" || raw.includes("drain")) return "Drainage or flooding";
  const exact = issueCategories.find((category) => category.toLowerCase() === raw);
  if (exact) return exact;
  if (raw.includes("pothole")) return "Pothole";
  if (raw.includes("sidewalk")) return "Broken sidewalk";
  if (raw.includes("streetlight") || raw.includes("street light")) return "Broken streetlight";
  if (raw.includes("dump") || raw.includes("trash") || raw.includes("garbage")) return "Trash or illegal dumping";
  if (raw.includes("mold")) return "Mold";
  if (raw.includes("rental") || raw.includes("landlord")) return "Unsafe rental condition";
  if (raw.includes("building")) return "Unsafe building";
  if (raw.includes("tree")) return "Downed tree";
  if (raw.includes("power") || raw.includes("wire")) return "Power line or utility hazard";
  if (raw.includes("water leak")) return "Water leak";
  if (raw.includes("water damage")) return "Water damage";
  if (raw.includes("hoa")) return "HOA issue";
  return "Other local problem";
}

function searchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function jurisdictionLabel(input: ContactRoutingInput) {
  return [input.city, input.county ? `${input.county} County` : null, input.state, input.zipCode]
    .map((value) => clean(value))
    .filter(Boolean)
    .join(", ");
}

function isStale(sourceLastVerifiedAt: string | null) {
  if (!sourceLastVerifiedAt) return true;
  const verifiedAt = new Date(sourceLastVerifiedAt);
  const now = new Date();
  const days = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24);
  return days > 365;
}

function matchesJurisdiction(record: VerifiedContactRecord, input: ContactRoutingInput) {
  return (
    record.city.toLowerCase() === clean(input.city).toLowerCase() &&
    record.state.toLowerCase() === clean(input.state).toLowerCase()
  );
}

function verifiedMatches(category: string, input: ContactRoutingInput) {
  return verifiedContactDirectory.filter(
    (record) => record.category === category && matchesJurisdiction(record, input)
  );
}

function emergencyRequired(input: ContactRoutingInput, category: string) {
  const text = `${input.userNotes ?? ""} ${input.imageClassificationResult?.category ?? ""}`.toLowerCase();
  return (
    Boolean(input.urgent) ||
    category === "Power line or utility hazard" ||
    emergencySignals.some((signal) => text.includes(signal))
  );
}

function verifiedContactToRouted(record: VerifiedContactRecord): RoutedContact {
  return {
    ...record.contact,
    confidence: isStale(record.contact.sourceLastVerifiedAt) ? "MEDIUM" : "HIGH",
    reasonForRecommendation: `Exact category and jurisdiction match for ${record.category} in ${record.city}, ${record.state}.`
  };
}

function fallbackContacts(category: string, input: ContactRoutingInput): RoutedContact[] {
  const jurisdiction = jurisdictionLabel(input) || "your area";
  return (categoryDepartments[category] ?? categoryDepartments["Other local problem"]).map((template) => {
    const query = `official ${jurisdiction} ${template.department} contact phone email`;
    const confidence: RoutingConfidence = clean(input.city) && clean(input.state) ? "MEDIUM" : "LOW";
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
      confidence,
      reasonForRecommendation: template.reason,
      reason: template.reason,
      verificationNote:
        "Open the lookup link and verify the current phone/email on an official city, county, utility, landlord, property manager, or HOA page before sending."
    };
  });
}

export function routeContact(input: ContactRoutingInput): ContactRoutingResult {
  const selectedCategory = normalizeCategory(input.userSelectedCategory);
  const imageCategory = normalizeCategory(input.imageClassificationResult?.category);
  const finalCategory =
    selectedCategory !== "Other local problem" ? selectedCategory : imageCategory || "Other local problem";
  const fallbackWarnings: string[] = [];

  if (!clean(input.city) || !clean(input.state)) {
    fallbackWarnings.push("City and state are required for jurisdiction-specific routing.");
  }
  if (selectedCategory === "Other local problem") {
    fallbackWarnings.push("The issue category is broad, so manual recipient review is required.");
  }

  const exact = verifiedMatches(finalCategory, input);
  const suggestedContacts = exact.length > 0 ? exact.map(verifiedContactToRouted) : fallbackContacts(finalCategory, input);
  const bestConfidence = suggestedContacts[0]?.confidence ?? "LOW";

  if (exact.length === 0) {
    fallbackWarnings.push("No verified exact contact was found in the local directory for this jurisdiction and category.");
  }
  if (suggestedContacts.some((contact) => isStale(contact.sourceLastVerifiedAt))) {
    fallbackWarnings.push("One or more contact sources are missing or stale and must be verified before sending.");
  }

  const confidenceScore = bestConfidence === "HIGH" ? 0.92 : bestConfidence === "MEDIUM" ? 0.66 : 0.38;
  const manualReviewRequired = bestConfidence !== "HIGH" || fallbackWarnings.length > 0;
  const emergencyWarningRequired = emergencyRequired(input, finalCategory);

  if (emergencyWarningRequired) {
    fallbackWarnings.push("This may involve immediate danger. Call emergency services if there is any urgent risk.");
  }

  return {
    suggestedContacts: suggestedContacts.slice(0, 3),
    confidenceScore,
    explanation:
      exact.length > 0
        ? `ReportRight AI found a verified ${finalCategory} contact for ${jurisdictionLabel(input)}.`
        : `ReportRight AI matched ${finalCategory} to likely departments for ${jurisdictionLabel(input) || "the provided location"}, but could not verify an exact recipient.`,
    fallbackWarnings,
    manualReviewRequired,
    emergencyWarningRequired
  };
}

export const contactRoutingService = {
  route: routeContact
};
