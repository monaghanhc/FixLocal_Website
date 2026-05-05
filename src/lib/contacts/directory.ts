import type { AIReportInput } from "@/lib/ai/types";

export type SuggestedContactDTO = {
  name: string;
  type: string;
  email: string;
  phone: string;
  website: string;
  reason: string;
};

const genericContacts: Record<string, SuggestedContactDTO> = {
  publicWorks: {
    name: "Local Public Works Service Desk",
    type: "City Public Works",
    email: "publicworks@example-city.test",
    phone: "(555) 010-2200",
    website: "https://example-city.test/public-works",
    reason: "Public Works commonly handles streets, sidewalks, drainage, signs, and related infrastructure."
  },
  code: {
    name: "Local Code Enforcement Office",
    type: "Code Enforcement",
    email: "codeenforcement@example-city.test",
    phone: "(555) 010-3300",
    website: "https://example-city.test/code-enforcement",
    reason: "Code enforcement can review unsafe property, nuisance, sanitation, and unresolved habitability concerns."
  },
  property: {
    name: "Property Manager or Landlord",
    type: "Property Manager",
    email: "maintenance@example-property.test",
    phone: "(555) 010-4400",
    website: "https://example-property.test/maintenance",
    reason: "Rental and building condition issues should generally be reported to the property owner or manager first."
  },
  hoa: {
    name: "Neighborhood HOA or Community Manager",
    type: "HOA",
    email: "manager@example-hoa.test",
    phone: "(555) 010-5500",
    website: "https://example-hoa.test/requests",
    reason: "HOAs and community managers may handle private streets, shared amenities, landscaping, and common areas."
  },
  dot: {
    name: "Transportation Maintenance Desk",
    type: "Department of Transportation",
    email: "roadmaintenance@example-state.test",
    phone: "(555) 010-6600",
    website: "https://example-state.test/transportation",
    reason: "Transportation agencies often handle state roads, traffic signs, and higher-volume corridors."
  },
  utility: {
    name: "Electric Utility Streetlight Team",
    type: "Utility Company",
    email: "streetlights@example-utility.test",
    phone: "(555) 010-7700",
    website: "https://example-utility.test/streetlights",
    reason: "Streetlight outages and utility equipment concerns are often routed to the local electric utility."
  },
  sanitation: {
    name: "Sanitation and Illegal Dumping Hotline",
    type: "Sanitation Department",
    email: "sanitation@example-city.test",
    phone: "(555) 010-8800",
    website: "https://example-city.test/sanitation",
    reason: "Trash, debris, and illegal dumping are commonly handled by sanitation or solid waste teams."
  },
  stormwater: {
    name: "Stormwater and Drainage Team",
    type: "Stormwater Department",
    email: "stormwater@example-city.test",
    phone: "(555) 010-9900",
    website: "https://example-city.test/stormwater",
    reason: "Flooding, standing water, blocked drains, and runoff concerns are usually handled by stormwater staff."
  }
};

function localize(contact: SuggestedContactDTO, city: string) {
  if (!city.trim()) return contact;
  return {
    ...contact,
    name: contact.name.replace("Local", city)
  };
}

export function suggestContacts(input: AIReportInput): SuggestedContactDTO[] {
  const city = input.city || "Local";
  const byCategory: Record<string, SuggestedContactDTO[]> = {
    Pothole: [genericContacts.publicWorks, genericContacts.dot],
    "Broken sidewalk": [genericContacts.publicWorks, genericContacts.code],
    "Trash or illegal dumping": [genericContacts.sanitation, genericContacts.code],
    "Unsafe rental condition": [genericContacts.property, genericContacts.code],
    Mold: [genericContacts.property, genericContacts.code],
    "Broken streetlight": [genericContacts.utility, genericContacts.publicWorks],
    Flooding: [genericContacts.stormwater, genericContacts.publicWorks],
    "Damaged sign": [genericContacts.dot, genericContacts.publicWorks],
    "Unsafe wiring": [genericContacts.code, genericContacts.property, genericContacts.utility],
    "Water damage": [genericContacts.property, genericContacts.code],
    "Other local problem": [genericContacts.publicWorks, genericContacts.code, genericContacts.hoa]
  };

  const contacts = byCategory[input.category] ?? byCategory["Other local problem"];
  return contacts.map((contact) => localize(contact, city)).slice(0, 3);
}
