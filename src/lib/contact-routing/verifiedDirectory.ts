import type { VerifiedContactRecord } from "./types";

// Small curated starter directory. Real deployments should replace or extend this
// with a maintained official-source ingestion workflow.
export const verifiedContactDirectory: VerifiedContactRecord[] = [
  {
    id: "nyc-pothole-311",
    category: "Pothole",
    city: "New York",
    state: "NY",
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
  }
];
