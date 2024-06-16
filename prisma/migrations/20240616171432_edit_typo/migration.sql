-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "message" TEXT,
    "stripePaymentId" TEXT NOT NULL,
    "donationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "donatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Donations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Donations" ("amount", "campaignId", "donatedAt", "donationStatus", "id", "message", "stripePaymentId") SELECT "amount", "campaignId", "donatedAt", "donationStatus", "id", "message", "stripePaymentId" FROM "Donations";
DROP TABLE "Donations";
ALTER TABLE "new_Donations" RENAME TO "Donations";
CREATE UNIQUE INDEX "Donations_stripePaymentId_key" ON "Donations"("stripePaymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
