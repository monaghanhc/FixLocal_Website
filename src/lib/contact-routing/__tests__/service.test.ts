import { afterEach, describe, expect, it } from "vitest";
import { normalizeRoutingCategory, routeContact } from "../service";
import { verifiedContactDirectory } from "../verifiedDirectory";

const baseLocation = {
  address: "100 Meeting Street",
  city: "Charleston",
  county: "Charleston",
  state: "SC",
  zipCode: "29401"
};

describe("ContactRoutingService", () => {
  const originalLength = verifiedContactDirectory.length;

  afterEach(() => {
    verifiedContactDirectory.length = originalLength;
  });

  it("normalizes common AI classification labels into issue categories", () => {
    expect(normalizeRoutingCategory("Road surface hazard")).toBe("Pothole");
    expect(normalizeRoutingCategory("Indoor moisture and possible mold")).toBe("Mold");
    expect(normalizeRoutingCategory("Utility safety hazard")).toBe("Power line or utility hazard");
    expect(normalizeRoutingCategory("Local service request")).toBe("Other local problem");
  });

  it("routes potholes to public works or DOT recipients", () => {
    const result = routeContact({
      ...baseLocation,
      city: "Mount Pleasant",
      userSelectedCategory: "Pothole",
      userNotes: "Large pothole in the right lane."
    });

    expect(result.issueCategory).toBe("Pothole");
    expect(result.suggestedContacts.map((contact) => contact.type)).toContain("City Public Works");
    expect(result.suggestedContacts.map((contact) => contact.type)).toContain("Department of Transportation");
    expect(result.confidenceLabel).toBe("LOW");
    expect(result.manualReviewRequired).toBe(true);
    expect(result.fallbackWarnings.join(" ")).toContain("sample data");
  });

  it("routes mold to landlord/property management and code enforcement style recipients", () => {
    const result = routeContact({
      ...baseLocation,
      userSelectedCategory: "Mold",
      userNotes: "Black mold under a bathroom sink in a rental unit."
    });

    expect(result.suggestedContacts[0].type).toBe("Code Enforcement");
    expect(result.suggestedContacts[0].source).toContain("Sample data");
    expect(result.explanation).toContain("Mold");
  });

  it("routes trash and illegal dumping to sanitation or code enforcement", () => {
    const result = routeContact({
      ...baseLocation,
      city: "Hollywood",
      userSelectedCategory: "Trash or illegal dumping",
      userNotes: "Illegal dumping near the roadside."
    });

    expect(result.suggestedContacts[0].type).toBe("Sanitation Department");
    expect(result.suggestedContacts[0].department).toContain("Solid Waste");
    expect(result.likelyJurisdiction).toBe("Hollywood, SC");
  });

  it("routes drainage and flooding to stormwater or public works", () => {
    const result = routeContact({
      ...baseLocation,
      userSelectedCategory: "Drainage or flooding",
      userNotes: "Blocked storm drain and standing water after rain."
    });

    expect(result.suggestedContacts[0].type).toBe("Stormwater Department");
    expect(result.suggestedContacts[0].department).toContain("Stormwater");
  });

  it("routes utility hazards to a utility contact and requires an emergency warning", () => {
    const result = routeContact({
      ...baseLocation,
      userSelectedCategory: "Power line or utility hazard",
      userNotes: "Downed wire is sparking near the sidewalk.",
      urgent: true
    });

    expect(result.suggestedContacts[0].type).toBe("Utility Company");
    expect(result.emergencyWarningRequired).toBe(true);
    expect(result.fallbackWarnings.join(" ")).toContain("call emergency services");
  });

  it("returns high confidence for an exact verified jurisdiction and category match", () => {
    const result = routeContact({
      userSelectedCategory: "Pothole",
      userNotes: "Large pothole in the street.",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    });

    expect(result.suggestedContacts[0].confidence).toBe("HIGH");
    expect(result.confidenceLabel).toBe("HIGH");
    expect(result.confidenceScore).toBeGreaterThan(0.9);
    expect(result.manualReviewRequired).toBe(false);
  });

  it("returns medium confidence for a verified general jurisdiction source", () => {
    verifiedContactDirectory.push({
      id: "test-general-sidewalk-source",
      category: "Broken sidewalk",
      city: "Testville",
      state: "TX",
      jurisdictionLevel: "city",
      sourceKind: "verified-general",
      contact: {
        name: "Testville Public Works",
        organization: "City of Testville",
        department: "Public Works",
        type: "City Public Works",
        email: null,
        phone: "311",
        website: "https://example.com/public-works",
        lookupUrl: "https://example.com/public-works",
        source: "Official general public works page",
        sourceLastVerifiedAt: new Date().toISOString().slice(0, 10),
        reason: "General official public works source for sidewalk issues.",
        verificationNote: "Verify this general department can accept sidewalk reports."
      }
    });

    const result = routeContact({
      userSelectedCategory: "Broken sidewalk",
      userNotes: "Raised sidewalk blocks wheelchair access.",
      city: "Testville",
      state: "TX",
      zipCode: "73301"
    });

    expect(result.confidenceLabel).toBe("MEDIUM");
    expect(result.manualReviewRequired).toBe(true);
    expect(result.suggestedContacts[0].reasonForRecommendation).toContain("general");
  });

  it("returns low confidence fallback when location is incomplete", () => {
    const result = routeContact({
      userSelectedCategory: "Other local problem",
      userNotes: "Not sure where this goes.",
      latitude: 32.78,
      longitude: -79.93
    });

    expect(result.suggestedContacts[0].confidence).toBe("LOW");
    expect(result.confidenceLabel).toBe("LOW");
    expect(result.manualReviewRequired).toBe(true);
    expect(result.fallbackWarnings.join(" ")).toContain("GPS was provided");
  });

  it("returns a manual recipient override and still requires review", () => {
    const result = routeContact({
      ...baseLocation,
      userSelectedCategory: "HOA issue",
      userNotes: "Broken gate in managed community.",
      manualRecipient: {
        name: "Community Manager",
        organization: "Example HOA",
        department: "Community Management",
        type: "HOA",
        email: "manager@example.test",
        phone: null,
        website: "https://example.test",
        lookupUrl: "https://example.test",
        source: "User verified manual entry",
        sourceLastVerifiedAt: "2026-05-19",
        confidence: "LOW",
        reasonForRecommendation: "User selected HOA contact.",
        reason: "Manual recipient override.",
        verificationNote: "User must verify before sending."
      }
    });

    expect(result.suggestedContacts).toHaveLength(1);
    expect(result.suggestedContacts[0].organization).toBe("Example HOA");
    expect(result.manualReviewRequired).toBe(true);
    expect(result.explanation).toContain("manual recipient override");
  });
});
