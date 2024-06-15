/*
  Warnings:

  - You are about to drop the column `amountRequired` on the `Donations` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Donations` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "officialId" TEXT NOT NULL,
    "amountRequired" INTEGER NOT NULL,
    "amountRaised" INTEGER NOT NULL DEFAULT 0,
    "amountLeft" INTEGER NOT NULL DEFAULT 0,
    "purpose" TEXT NOT NULL,
    "CampaaignStatus" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "Campaaigns_officialId_fkey" FOREIGN KEY ("officialId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Campaaigns" ("CampaaignStatus", "amountLeft", "amountRaised", "amountRequired", "description", "id", "name", "officialId", "purpose") SELECT "CampaaignStatus", "amountLeft", "amountRaised", "amountRequired", "description", "id", "name", "officialId", "purpose" FROM "Campaaigns";
DROP TABLE "Campaaigns";
ALTER TABLE "new_Campaaigns" RENAME TO "Campaaigns";
CREATE UNIQUE INDEX "Campaaigns_name_key" ON "Campaaigns"("name");
CREATE UNIQUE INDEX "Campaaigns_officialId_key" ON "Campaaigns"("officialId");
CREATE TABLE "new_Donations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "message" TEXT,
    "stripePaymentId" TEXT NOT NULL,
    "donationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "donatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaaignId" TEXT NOT NULL,
    CONSTRAINT "Donations_campaaignId_fkey" FOREIGN KEY ("campaaignId") REFERENCES "Campaaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donations" ("campaaignId", "donatedAt", "donationStatus", "id", "message", "stripePaymentId") SELECT "campaaignId", "donatedAt", "donationStatus", "id", "message", "stripePaymentId" FROM "Donations";
DROP TABLE "Donations";
ALTER TABLE "new_Donations" RENAME TO "Donations";
CREATE UNIQUE INDEX "Donations_stripePaymentId_key" ON "Donations"("stripePaymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
