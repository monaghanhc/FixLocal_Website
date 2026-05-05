import type { AIProvider, AIReportInput, AIReportResult, ResponsibleParty, Severity } from "./types";

const urgentSignals = [
  "dangerous",
  "injury",
  "injured",
  "unsafe",
  "sparking",
  "electrical",
  "shock",
  "flooding",
  "blocked",
  "leaking",
  "collapse",
  "mold",
  "sewage",
  "fire",
  "exposed",
  "hazard"
];

function locationLine(input: AIReportInput) {
  return `${input.address}, ${input.city}, ${input.state} ${input.zip}`;
}

function observedDate(input: AIReportInput) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(input.dateObserved));
}

function detectIssueType(input: AIReportInput) {
  const categoryMap: Record<string, string> = {
    Pothole: "Road surface hazard",
    "Broken sidewalk": "Pedestrian walkway hazard",
    "Trash or illegal dumping": "Illegal dumping or sanitation concern",
    "Unsafe rental condition": "Rental habitability concern",
    Mold: "Indoor moisture and possible mold",
    "Broken streetlight": "Streetlight outage",
    Flooding: "Drainage or stormwater concern",
    "Damaged sign": "Damaged public sign",
    "Unsafe wiring": "Electrical safety hazard",
    "Water damage": "Water intrusion and damage",
    "Other local problem": "Local service request"
  };

  return categoryMap[input.category] ?? "Local service request";
}

function estimateSeverity(input: AIReportInput): Severity {
  const text = `${input.title} ${input.description} ${input.optionalNotes ?? ""}`.toLowerCase();
  const score = urgentSignals.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0);

  if (input.urgent && score >= 2) return "URGENT";
  if (input.urgent || score >= 3) return "HIGH";
  if (score >= 1) return "MEDIUM";
  return "LOW";
}

function responsibleParty(input: AIReportInput): ResponsibleParty {
  const map: Record<string, ResponsibleParty> = {
    Pothole: "City Public Works",
    "Broken sidewalk": "City Public Works",
    "Trash or illegal dumping": "Sanitation Department",
    "Unsafe rental condition": "Property Manager",
    Mold: "Property Manager",
    "Broken streetlight": "Utility Company",
    Flooding: "Stormwater Department",
    "Damaged sign": "Department of Transportation",
    "Unsafe wiring": "Code Enforcement",
    "Water damage": "Property Manager",
    "Other local problem": "Other"
  };

  return map[input.category] ?? "Other";
}

function missingDetails(input: AIReportInput) {
  const base = [
    "Approximate size or affected area",
    "Whether the condition is getting worse",
    "Any prior report or request number"
  ];

  const categorySpecific: Record<string, string[]> = {
    Pothole: ["Nearest lane or cross street", "Whether vehicles are swerving or striking it"],
    "Broken sidewalk": ["Whether wheelchair or stroller access is blocked", "Approximate trip height"],
    "Trash or illegal dumping": ["Type and estimated amount of material", "Whether hazardous items are visible"],
    "Unsafe rental condition": ["How long the condition has existed", "Whether the landlord has been notified"],
    Mold: ["Source of moisture or leak", "Whether anyone has symptoms"],
    "Broken streetlight": ["Pole number if visible", "Whether the outage affects an intersection"],
    Flooding: ["Depth of standing water", "Whether drains are blocked"],
    "Damaged sign": ["Sign type and direction of travel", "Whether visibility is obstructed"],
    "Unsafe wiring": ["Whether wires are exposed or sparking", "Whether power has been shut off"],
    "Water damage": ["Likely source of water", "Whether the material is soft or sagging"],
    "Other local problem": ["Who is affected", "Best access point for inspection"]
  };

  return [...(categorySpecific[input.category] ?? []), ...base].slice(0, 5);
}

function confidence(input: AIReportInput) {
  let value = 0.62;
  if (input.imagePath) value += 0.14;
  if (input.description.length > 60) value += 0.08;
  if (input.address && input.city && input.state) value += 0.08;
  if (input.optionalNotes && input.optionalNotes.length > 20) value += 0.04;
  return Math.min(0.94, Number(value.toFixed(2)));
}

function buildMessages(input: AIReportInput, severity: Severity, party: ResponsibleParty) {
  const location = locationLine(input);
  const date = observedDate(input);
  const urgentLine =
    severity === "URGENT" || severity === "HIGH"
      ? "Because this may present a safety or health risk, I am requesting prompt review."
      : "I am requesting review and repair when staff are able to inspect the location.";
  const notes = input.optionalNotes ? `\n\nAdditional notes: ${input.optionalNotes}` : "";
  const subjectLine = `Request for action: ${input.title} at ${input.address}`;

  const formalEmail = `Subject: ${subjectLine}

Hello,

I am reporting ${input.title.toLowerCase()} at ${location}. The issue was observed on ${date}.

Summary: ${input.description}

${urgentLine} I have a photo available as an attachment or reference image. Please inspect the location and let me know what action can be taken or which office should handle this if it is outside your department.${notes}

Thank you,
FixLocal AI user`;

  const smsMessage = `${input.title} at ${location}. Observed ${date}. ${input.description} Severity estimate: ${severity}. Photo available. Please inspect or route to ${party}.`;

  const printableReport = `FixLocal AI Report

Issue: ${input.title}
Category: ${input.category}
Location: ${location}
Date observed: ${date}
Estimated severity: ${severity}
Suggested responsible party: ${party}

Description:
${input.description}

Requested action:
Please inspect the location, document the condition, and schedule repair, cleanup, enforcement, or referral to the appropriate office. A photo is available for reference.${notes}

Disclaimer:
This report is AI-assisted and should be reviewed before submission. It is not legal advice. For emergencies, call emergency services.`;

  const followUpMessage = `Hello, I am following up on my report about ${input.title.toLowerCase()} at ${location}. It was observed on ${date}. Could you please confirm whether it has been inspected, assigned, or routed to the correct office?`;

  return {
    subjectLine,
    formalEmail,
    smsMessage,
    printableReport,
    followUpMessage
  };
}

export const mockProvider: AIProvider = {
  name: "mock",
  async analyzeAndGenerate(input: AIReportInput): Promise<AIReportResult> {
    const severity = estimateSeverity(input);
    const party = responsibleParty(input);

    return {
      analysis: {
        detectedIssueType: detectIssueType(input),
        severity,
        confidenceScore: confidence(input),
        missingDetails: missingDetails(input),
        suggestedResponsibleParty: party
      },
      messages: buildMessages(input, severity, party)
    };
  }
};
