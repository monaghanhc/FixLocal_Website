-- CreateTable
CREATE TABLE "UploadedImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "reportId" TEXT,
    "imagePath" TEXT NOT NULL,
    "originalName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UploadedImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UploadedImage_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IssueCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "responsibleDepartments" JSONB NOT NULL,
    "emergencyKeywords" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Jurisdiction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "county" TEXT,
    "state" TEXT NOT NULL,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "source" TEXT,
    "sourceLastVerifiedAt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lastVerifiedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jurisdictionId" TEXT,
    "sourceId" TEXT,
    "categorySlug" TEXT,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT NOT NULL,
    "confidence" TEXT NOT NULL DEFAULT 'LOW',
    "reasonForRecommendation" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contact_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contact_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ContactSource" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoutingDecision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "explanation" TEXT NOT NULL,
    "fallbackWarnings" JSONB NOT NULL,
    "manualReviewRequired" BOOLEAN NOT NULL,
    "emergencyWarningRequired" BOOLEAN NOT NULL,
    "selectedContactSnapshot" JSONB,
    "userVerifiedContact" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoutingDecision_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "reportLimit" INTEGER,
    "features" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserEntitlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'FREE',
    "currentPeriodStart" DATETIME,
    "currentPeriodEnd" DATETIME,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT,
    "providerCustomerId" TEXT,
    "providerSubscriptionId" TEXT,
    "manageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserEntitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserEntitlement_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UsageCounter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UsageCounter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "dateObserved" DATETIME NOT NULL,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "optionalNotes" TEXT,
    "imagePath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "detectedIssueType" TEXT,
    "confidenceScore" REAL,
    "suggestedResponsibleParty" TEXT,
    "missingDetails" JSONB,
    "formalEmail" TEXT,
    "smsMessage" TEXT,
    "printableReport" TEXT,
    "followUpMessage" TEXT,
    "recipientConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "selectedContactSnapshot" JSONB,
    "emergencyAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("address", "category", "city", "confidenceScore", "createdAt", "dateObserved", "description", "detectedIssueType", "followUpMessage", "formalEmail", "id", "imagePath", "missingDetails", "optionalNotes", "printableReport", "severity", "smsMessage", "state", "status", "suggestedResponsibleParty", "title", "updatedAt", "urgent", "userId", "zip") SELECT "address", "category", "city", "confidenceScore", "createdAt", "dateObserved", "description", "detectedIssueType", "followUpMessage", "formalEmail", "id", "imagePath", "missingDetails", "optionalNotes", "printableReport", "severity", "smsMessage", "state", "status", "suggestedResponsibleParty", "title", "updatedAt", "urgent", "userId", "zip" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE INDEX "Report_userId_idx" ON "Report"("userId");
CREATE INDEX "Report_status_idx" ON "Report"("status");
CREATE INDEX "Report_category_idx" ON "Report"("category");
CREATE TABLE "new_SuggestedContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL DEFAULT '',
    "department" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT NOT NULL,
    "lookupUrl" TEXT,
    "source" TEXT NOT NULL DEFAULT 'Official-source lookup required',
    "sourceLastVerifiedAt" TEXT,
    "confidence" TEXT NOT NULL DEFAULT 'LOW',
    "reasonForRecommendation" TEXT NOT NULL DEFAULT '',
    "verificationNote" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SuggestedContact_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SuggestedContact" ("createdAt", "email", "id", "lookupUrl", "name", "phone", "reason", "reportId", "type", "verificationNote", "website") SELECT "createdAt", "email", "id", "lookupUrl", "name", "phone", "reason", "reportId", "type", "verificationNote", "website" FROM "SuggestedContact";
DROP TABLE "SuggestedContact";
ALTER TABLE "new_SuggestedContact" RENAME TO "SuggestedContact";
CREATE INDEX "SuggestedContact_reportId_idx" ON "SuggestedContact"("reportId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "UploadedImage_userId_idx" ON "UploadedImage"("userId");

-- CreateIndex
CREATE INDEX "UploadedImage_reportId_idx" ON "UploadedImage"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "IssueCategory_slug_key" ON "IssueCategory"("slug");

-- CreateIndex
CREATE INDEX "Jurisdiction_city_state_idx" ON "Jurisdiction"("city", "state");

-- CreateIndex
CREATE INDEX "Jurisdiction_county_state_idx" ON "Jurisdiction"("county", "state");

-- CreateIndex
CREATE INDEX "Contact_jurisdictionId_idx" ON "Contact"("jurisdictionId");

-- CreateIndex
CREATE INDEX "Contact_categorySlug_idx" ON "Contact"("categorySlug");

-- CreateIndex
CREATE UNIQUE INDEX "RoutingDecision_reportId_key" ON "RoutingDecision"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_slug_key" ON "SubscriptionPlan"("slug");

-- CreateIndex
CREATE INDEX "UserEntitlement_userId_idx" ON "UserEntitlement"("userId");

-- CreateIndex
CREATE INDEX "UserEntitlement_status_idx" ON "UserEntitlement"("status");

-- CreateIndex
CREATE INDEX "UsageCounter_periodKey_idx" ON "UsageCounter"("periodKey");

-- CreateIndex
CREATE UNIQUE INDEX "UsageCounter_userId_periodKey_action_key" ON "UsageCounter"("userId", "periodKey", "action");
