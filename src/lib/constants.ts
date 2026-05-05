export const issueCategories = [
  "Pothole",
  "Broken sidewalk",
  "Trash or illegal dumping",
  "Unsafe rental condition",
  "Mold",
  "Broken streetlight",
  "Flooding",
  "Damaged sign",
  "Unsafe wiring",
  "Water damage",
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
  "Other"
] as const;
