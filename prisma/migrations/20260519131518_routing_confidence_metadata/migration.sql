-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoutingDecision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "confidenceLabel" TEXT NOT NULL DEFAULT 'LOW',
    "issueCategory" TEXT NOT NULL DEFAULT '',
    "likelyJurisdiction" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL,
    "fallbackWarnings" JSONB NOT NULL,
    "manualReviewRequired" BOOLEAN NOT NULL,
    "emergencyWarningRequired" BOOLEAN NOT NULL,
    "selectedContactSnapshot" JSONB,
    "userVerifiedContact" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoutingDecision_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RoutingDecision" ("confidenceScore", "createdAt", "emergencyWarningRequired", "explanation", "fallbackWarnings", "id", "manualReviewRequired", "reportId", "selectedContactSnapshot", "userVerifiedContact") SELECT "confidenceScore", "createdAt", "emergencyWarningRequired", "explanation", "fallbackWarnings", "id", "manualReviewRequired", "reportId", "selectedContactSnapshot", "userVerifiedContact" FROM "RoutingDecision";
DROP TABLE "RoutingDecision";
ALTER TABLE "new_RoutingDecision" RENAME TO "RoutingDecision";
CREATE UNIQUE INDEX "RoutingDecision_reportId_key" ON "RoutingDecision"("reportId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
