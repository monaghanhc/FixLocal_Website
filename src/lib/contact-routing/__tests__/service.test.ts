import { describe, expect, it } from "vitest";
import { routeContact } from "../service";

describe("ContactRoutingService", () => {
  it("routes issue categories to likely departments", () => {
    const result = routeContact({
      userSelectedCategory: "Power line or utility hazard",
      userNotes: "Downed wire is sparking near the sidewalk.",
      city: "Riverton",
      state: "OH",
      zipCode: "43001",
      urgent: true
    });

    expect(result.suggestedContacts[0].type).toBe("Utility Company");
    expect(result.emergencyWarningRequired).toBe(true);
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
    expect(result.confidenceScore).toBeGreaterThan(0.9);
    expect(result.manualReviewRequired).toBe(false);
  });

  it("returns medium confidence for jurisdiction plus general department match", () => {
    const result = routeContact({
      userSelectedCategory: "Broken sidewalk",
      userNotes: "Sidewalk is raised and cracked.",
      city: "Riverton",
      state: "OH",
      zipCode: "43001"
    });

    expect(result.suggestedContacts[0].confidence).toBe("MEDIUM");
    expect(result.manualReviewRequired).toBe(true);
  });

  it("returns low confidence fallback when location is incomplete", () => {
    const result = routeContact({
      userSelectedCategory: "Other local problem",
      userNotes: "Not sure where this goes."
    });

    expect(result.suggestedContacts[0].confidence).toBe("LOW");
    expect(result.manualReviewRequired).toBe(true);
    expect(result.fallbackWarnings.length).toBeGreaterThan(0);
  });
});
