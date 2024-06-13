/*
  Warnings:

  - You are about to drop the column `officiaIdPic` on the `Users` table. All the data in the column will be lost.
  - Added the required column `officialIdPic` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OFFICIAL',
    "isVerfied" BOOLEAN NOT NULL DEFAULT false,
    "officialIdPic" TEXT NOT NULL
);
INSERT INTO "new_Users" ("email", "hashedPassword", "id", "isVerfied", "name", "role") SELECT "email", "hashedPassword", "id", "isVerfied", "name", "role" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
