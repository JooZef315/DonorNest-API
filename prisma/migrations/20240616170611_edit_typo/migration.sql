/*
  Warnings:

  - You are about to drop the column `CampaignStatus` on the `Campaigns` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "officialId" TEXT NOT NULL,
    "amountRequired" INTEGER NOT NULL,
    "amountRaised" INTEGER NOT NULL DEFAULT 0,
    "amountLeft" INTEGER NOT NULL DEFAULT 0,
    "purpose" TEXT NOT NULL,
    "campaignStatus" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "Campaigns_officialId_fkey" FOREIGN KEY ("officialId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Campaigns" ("amountLeft", "amountRaised", "amountRequired", "description", "id", "name", "officialId", "purpose") SELECT "amountLeft", "amountRaised", "amountRequired", "description", "id", "name", "officialId", "purpose" FROM "Campaigns";
DROP TABLE "Campaigns";
ALTER TABLE "new_Campaigns" RENAME TO "Campaigns";
CREATE UNIQUE INDEX "Campaigns_name_key" ON "Campaigns"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
