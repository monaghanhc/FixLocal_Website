-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SuggestedContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT NOT NULL,
    "lookupUrl" TEXT,
    "verificationNote" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SuggestedContact_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SuggestedContact" ("createdAt", "email", "id", "name", "phone", "reason", "reportId", "type", "website") SELECT "createdAt", "email", "id", "name", "phone", "reason", "reportId", "type", "website" FROM "SuggestedContact";
DROP TABLE "SuggestedContact";
ALTER TABLE "new_SuggestedContact" RENAME TO "SuggestedContact";
CREATE INDEX "SuggestedContact_reportId_idx" ON "SuggestedContact"("reportId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
