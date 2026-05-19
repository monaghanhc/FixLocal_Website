export const issueCategories = [
  "Pothole",
  "Broken sidewalk",
  "Trash or illegal dumping",
  "Unsafe rental condition",
  "Mold",
  "Broken streetlight",
  "Drainage or flooding",
  "Damaged sign",
  "Unsafe wiring",
  "Unsafe building",
  "Downed tree",
  "Power line or utility hazard",
  "Water leak",
  "Water damage",
  "HOA issue",
  "Other local problem"
] as const;

export const reportStatuses = [
  "DRAFT",
  "SUBMITTED",
  "WAITING_RESPONSE",
  "NEEDS_FOLLOW_UP",
  "RESOLVED",
  "CLOSED"
] as const;

export const severities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const responsibleParties = [
  "City Public Works",
  "Code Enforcement",
  "Property Manager",
  "HOA",
  "Department of Transportation",
  "Utility Company",
  "Sanitation Department",
  "Stormwater Department",
  "Housing Authority",
  "Building Inspections",
  "Parks Department",
  "Water Department",
  "Emergency Services",
  "Other"
] as const;

export const productName = "ReportRight AI";
export const legacyProductName = "FixLocal AI";
