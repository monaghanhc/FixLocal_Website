import type { AIReportInput } from "@/lib/ai/types";

export type SuggestedContactDTO = {
  name: string;
  type: string;
  email?: string | null;
  phone?: string | null;
  website: string;
  lookupUrl?: string | null;
  verificationNote?: string | null;
  reason: string;
};

function searchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function makeContact(input: AIReportInput, type: string, office: string, reason: string): SuggestedContactDTO {
  const location = [input.city, input.state].filter(Boolean).join(" ");
  const query =
    type === "Property Manager" || type === "HOA"
      ? `${office} contact phone email ${input.address} ${location}`.trim()
      : `official ${location} ${office} contact phone email`.trim();

  return {
    name: `${location || "Local"} ${office}`,
    type,
    email: null,
    phone: null,
    website: searchUrl(query),
    lookupUrl: searchUrl(query),
    verificationNote:
      "Phone and email are intentionally not auto-filled unless verified from an official source. Open the lookup link and use the official city, county, utility, landlord, or HOA contact page.",
    reason
  };
}

export function suggestContacts(input: AIReportInput): SuggestedContactDTO[] {
  const byCategory: Record<string, SuggestedContactDTO[]> = {
    Pothole: [
      makeContact(input, "City Public Works", "Public Works", "Potholes and local road hazards are commonly handled by Public Works."),
      makeContact(input, "Department of Transportation", "Department of Transportation road maintenance", "Use this if the road is state-maintained or a major corridor.")
    ],
    "Broken sidewalk": [
      makeContact(input, "City Public Works", "Public Works sidewalk repair", "Sidewalk hazards are commonly handled by Public Works or transportation staff."),
      makeContact(input, "Code Enforcement", "Code Enforcement", "Code enforcement may help when the sidewalk is tied to private property obligations.")
    ],
    "Trash or illegal dumping": [
      makeContact(input, "Sanitation Department", "Sanitation illegal dumping", "Dumping and debris issues are commonly routed to sanitation or solid waste teams."),
      makeContact(input, "Code Enforcement", "Code Enforcement nuisance complaint", "Code enforcement may handle recurring nuisance or property violations.")
    ],
    "Unsafe rental condition": [
      makeContact(input, "Property Manager", "property manager maintenance", "Rental habitability issues should usually be reported to the landlord or property manager first."),
      makeContact(input, "Code Enforcement", "Code Enforcement housing inspection", "Use code enforcement if the condition remains unresolved or appears unsafe.")
    ],
    Mold: [
      makeContact(input, "Property Manager", "property manager maintenance mold", "Mold or water intrusion should usually be reported to the landlord or property manager first."),
      makeContact(input, "Code Enforcement", "Code Enforcement housing inspection mold", "Use code enforcement if the issue is not addressed or appears unsafe.")
    ],
    "Broken streetlight": [
      makeContact(input, "Utility Company", "streetlight outage utility", "Streetlight outages are often handled by the electric utility or a city streetlight team."),
      makeContact(input, "City Public Works", "Public Works streetlight outage", "Public Works may route city-owned streetlight issues.")
    ],
    Flooding: [
      makeContact(input, "Stormwater Department", "Stormwater drainage flooding", "Flooding, blocked drains, and runoff issues are commonly handled by stormwater staff."),
      makeContact(input, "City Public Works", "Public Works drainage flooding", "Public Works may handle street drainage and blocked infrastructure.")
    ],
    "Damaged sign": [
      makeContact(input, "Department of Transportation", "traffic sign maintenance", "Damaged traffic signs are commonly handled by transportation or road maintenance staff."),
      makeContact(input, "City Public Works", "Public Works sign maintenance", "Local signs may be handled by Public Works.")
    ],
    "Unsafe wiring": [
      makeContact(input, "Code Enforcement", "Code Enforcement unsafe wiring", "Unsafe wiring may require code enforcement or building inspection review."),
      makeContact(input, "Utility Company", "electric utility emergency unsafe wire", "Use the utility emergency line if wires are exposed, downed, or sparking.")
    ],
    "Water damage": [
      makeContact(input, "Property Manager", "property manager maintenance water damage", "Water damage in a rental should usually be reported to the landlord or property manager first."),
      makeContact(input, "Code Enforcement", "Code Enforcement housing inspection water damage", "Use code enforcement if the issue remains unresolved or appears unsafe.")
    ],
    "Other local problem": [
      makeContact(input, "City Public Works", "Public Works service request", "Public Works is a common starting point for local infrastructure issues."),
      makeContact(input, "Code Enforcement", "Code Enforcement complaint", "Code enforcement may handle nuisance, safety, and property-condition issues."),
      makeContact(input, "HOA", "HOA community manager contact", "HOAs or community managers may handle private roads, shared areas, and neighborhood rules.")
    ]
  };

  const contacts = byCategory[input.category] ?? byCategory["Other local problem"];
  return contacts.slice(0, 3);
}
