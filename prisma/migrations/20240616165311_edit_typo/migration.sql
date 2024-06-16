/*
  Warnings:

  - You are about to drop the `campaigns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "campaigns_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "campaigns";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "officialId" TEXT NOT NULL,
    "amountRequired" INTEGER NOT NULL,
    "amountRaised" INTEGER NOT NULL DEFAULT 0,
    "amountLeft" INTEGER NOT NULL DEFAULT 0,
    "purpose" TEXT NOT NULL,
    "CampaignStatus" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "Campaigns_officialId_fkey" FOREIGN KEY ("officialId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    CONSTRAINT "Donations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donations" ("amount", "campaignId", "donatedAt", "donationStatus", "id", "message", "stripePaymentId") SELECT "amount", "campaignId", "donatedAt", "donationStatus", "id", "message", "stripePaymentId" FROM "Donations";
DROP TABLE "Donations";
ALTER TABLE "new_Donations" RENAME TO "Donations";
CREATE UNIQUE INDEX "Donations_stripePaymentId_key" ON "Donations"("stripePaymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Campaigns_name_key" ON "Campaigns"("name");
