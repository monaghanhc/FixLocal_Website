import type { VerifiedContactRecord } from "./types";

// Small starter directory used by the local MVP. Records marked `sample` are
// intentionally not treated as verified contacts; they exist so routing can be
// tested locally without inventing official emails or phone numbers.
export const verifiedContactDirectory: VerifiedContactRecord[] = [
  {
    id: "nyc-pothole-311",
    category: "Pothole",
    city: "New York",
    state: "NY",
    jurisdictionLevel: "city",
    sourceKind: "verified-exact",
    contact: {
      name: "NYC311 Pothole Complaint",
      organization: "City of New York",
      department: "NYC311 / Department of Transportation routing",
      type: "City Public Works",
      email: null,
      phone: "311",
      website: "https://portal.311.nyc.gov/article/?kanumber=KA-01093",
      lookupUrl: "https://portal.311.nyc.gov/article/?kanumber=KA-01093",
      source: "Official NYC311 pothole service page",
      sourceLastVerifiedAt: "2026-05-19",
      reason: "Exact official NYC311 service page for pothole reporting.",
      verificationNote:
        "Use NYC311 online or call 311 from inside New York City. Call 911 for an unprotected street opening that could cause an accident."
    }
  },
  {
    id: "nyc-trash-dsny-311",
    category: "Trash or illegal dumping",
    city: "New York",
    state: "NY",
    jurisdictionLevel: "city",
    sourceKind: "verified-exact",
    contact: {
      name: "NYC Sanitation Report an Issue",
      organization: "New York City Department of Sanitation",
      department: "DSNY / NYC311 routing",
      type: "Sanitation Department",
      email: null,
      phone: "311",
      website: "https://www.nyc.gov/site/dsny/about/contact.page",
      lookupUrl: "https://www.nyc.gov/site/dsny/about/contact.page",
      source: "Official NYC Department of Sanitation contact page",
      sourceLastVerifiedAt: "2026-05-19",
      reason: "Exact official DSNY contact page for sanitation issue reporting.",
      verificationNote: "DSNY directs users to report issues online or by calling 311."
    }
  },
  {
    id: "seattle-illegal-dumping-spu",
    category: "Trash or illegal dumping",
    city: "Seattle",
    state: "WA",
    jurisdictionLevel: "city",
    sourceKind: "verified-exact",
    contact: {
      name: "Seattle Illegal Dumping Report",
      organization: "Seattle Public Utilities",
      department: "Clean City / Illegal Dumping",
      type: "Sanitation Department",
      email: null,
      phone: "(206) 684-7587",
      website:
        "https://seattle.gov/utilities/protecting-our-environment/seattle-clean-city/illegal-dumping",
      lookupUrl:
        "https://seattle.gov/utilities/protecting-our-environment/seattle-clean-city/illegal-dumping",
      source: "Official Seattle Public Utilities illegal dumping page",
      sourceLastVerifiedAt: "2026-05-19",
      reason: "Exact official Seattle Public Utilities page for illegal dumping.",
      verificationNote:
        "Seattle Public Utilities lists online reporting, Find It Fix It, and phone reporting for public-property illegal dumping."
    }
  },
  {
    id: "seattle-storm-drain-spu",
    category: "Drainage or flooding",
    city: "Seattle",
    state: "WA",
    jurisdictionLevel: "city",
    sourceKind: "verified-exact",
    contact: {
      name: "Seattle Plugged Storm Drain Report",
      organization: "Seattle Public Utilities",
      department: "Drainage and Wastewater",
      type: "Stormwater Department",
      email: null,
      phone: "(206) 386-1800",
      website: "https://www.seattle.gov/utilities/about/contacts",
      lookupUrl: "https://www.seattle.gov/utilities/about/contacts",
      source: "Official Seattle Public Utilities contact page",
      sourceLastVerifiedAt: "2026-05-19",
      reason: "Exact official Seattle Public Utilities contact page for storm drain reports.",
      verificationNote:
        "Seattle Public Utilities lists a plugged storm drain phone number on its official contacts page."
    }
  },
  {
    id: "mount-pleasant-sc-public-services-sample",
    category: "Pothole",
    city: "Mount Pleasant",
    county: "Charleston",
    state: "SC",
    jurisdictionLevel: "city",
    sourceKind: "sample",
    contact: {
      name: "Mount Pleasant Public Services Sample Contact",
      organization: "Town of Mount Pleasant, SC",
      department: "Public Services / Streets",
      type: "City Public Works",
      email: null,
      phone: null,
      website:
        "https://www.google.com/search?q=official+Mount+Pleasant+SC+public+services+pothole+contact",
      lookupUrl:
        "https://www.google.com/search?q=official+Mount+Pleasant+SC+public+services+pothole+contact",
      source: "Sample data for local development - not verified official contact",
      sourceLastVerifiedAt: null,
      reason: "Potholes on town-maintained roads are typically routed to public services or streets staff.",
      verificationNote:
        "Sample data only. Verify the current Town of Mount Pleasant contact on an official source before sending."
    }
  },
  {
    id: "charleston-sc-livability-sample",
    category: "Mold",
    city: "Charleston",
    county: "Charleston",
    state: "SC",
    jurisdictionLevel: "city",
    sourceKind: "sample",
    contact: {
      name: "Charleston Housing or Livability Sample Contact",
      organization: "City of Charleston, SC",
      department: "Housing, Livability, or Code Enforcement",
      type: "Code Enforcement",
      email: null,
      phone: null,
      website:
        "https://www.google.com/search?q=official+Charleston+SC+code+enforcement+housing+mold+contact",
      lookupUrl:
        "https://www.google.com/search?q=official+Charleston+SC+code+enforcement+housing+mold+contact",
      source: "Sample data for local development - not verified official contact",
      sourceLastVerifiedAt: null,
      reason:
        "Unresolved rental mold concerns may need landlord, property manager, housing, or code enforcement review.",
      verificationNote:
        "Sample data only. Verify the current landlord/property manager first, then confirm any official city contact before sending."
    }
  },
  {
    id: "charleston-county-sc-solid-waste-sample",
    category: "Trash or illegal dumping",
    county: "Charleston",
    state: "SC",
    jurisdictionLevel: "county",
    sourceKind: "sample",
    contact: {
      name: "Charleston County Solid Waste Sample Contact",
      organization: "Charleston County, SC",
      department: "Solid Waste or Environmental Management",
      type: "Sanitation Department",
      email: null,
      phone: null,
      website:
        "https://www.google.com/search?q=official+Charleston+County+SC+illegal+dumping+solid+waste+contact",
      lookupUrl:
        "https://www.google.com/search?q=official+Charleston+County+SC+illegal+dumping+solid+waste+contact",
      source: "Sample data for local development - not verified official contact",
      sourceLastVerifiedAt: null,
      reason:
        "Illegal dumping outside city-maintained areas is often routed to county solid waste, sanitation, or code staff.",
      verificationNote:
        "Sample data only. Verify the current Charleston County contact on an official source before sending."
    }
  },
  {
    id: "north-charleston-sc-code-sample",
    category: "Unsafe building",
    city: "North Charleston",
    county: "Charleston",
    state: "SC",
    jurisdictionLevel: "city",
    sourceKind: "sample",
    contact: {
      name: "North Charleston Code Enforcement Sample Contact",
      organization: "City of North Charleston, SC",
      department: "Code Enforcement or Building Inspections",
      type: "Code Enforcement",
      email: null,
      phone: null,
      website:
        "https://www.google.com/search?q=official+North+Charleston+SC+code+enforcement+building+inspection+contact",
      lookupUrl:
        "https://www.google.com/search?q=official+North+Charleston+SC+code+enforcement+building+inspection+contact",
      source: "Sample data for local development - not verified official contact",
      sourceLastVerifiedAt: null,
      reason:
        "Unsafe building conditions are commonly reviewed by code enforcement or building inspections.",
      verificationNote:
        "Sample data only. Verify the current City of North Charleston contact on an official source before sending."
    }
  },
  {
    id: "charleston-sc-stormwater-sample",
    category: "Drainage or flooding",
    city: "Charleston",
    county: "Charleston",
    state: "SC",
    jurisdictionLevel: "city",
    sourceKind: "sample",
    contact: {
      name: "Charleston Stormwater Sample Contact",
      organization: "City of Charleston, SC",
      department: "Stormwater or Public Works",
      type: "Stormwater Department",
      email: null,
      phone: null,
      website:
        "https://www.google.com/search?q=official+Charleston+SC+stormwater+flooding+drainage+contact",
      lookupUrl:
        "https://www.google.com/search?q=official+Charleston+SC+stormwater+flooding+drainage+contact",
      source: "Sample data for local development - not verified official contact",
      sourceLastVerifiedAt: null,
      reason:
        "Drainage, flooding, blocked drains, and runoff issues are commonly routed to stormwater or public works staff.",
      verificationNote:
        "Sample data only. Verify the current City of Charleston stormwater or public works contact before sending."
    }
  },
  {
    id: "scdot-pothole-state-road-sample",
    category: "Pothole",
    state: "SC",
    jurisdictionLevel: "state",
    sourceKind: "sample",
    contact: {
      name: "SCDOT State-Maintained Road Sample Contact",
      organization: "South Carolina Department of Transportation",
      department: "Maintenance / State DOT",
      type: "Department of Transportation",
      email: null,
      phone: null,
      website:
        "https://www.google.com/search?q=official+SCDOT+pothole+road+maintenance+contact",
      lookupUrl:
        "https://www.google.com/search?q=official+SCDOT+pothole+road+maintenance+contact",
      source: "Sample data for local development - not verified official contact",
      sourceLastVerifiedAt: null,
      reason:
        "A state DOT may handle potholes on state-maintained routes or highways.",
      verificationNote:
        "Sample data only. Verify whether the road is state-maintained and confirm the current SCDOT contact before sending."
    }
  }
];
