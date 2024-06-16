-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OFFICIAL',
    "isVerfied" BOOLEAN NOT NULL DEFAULT false,
    "officiaIdPic" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "officialId" TEXT NOT NULL,
    "amountRequired" INTEGER NOT NULL,
    "amountRaised" INTEGER NOT NULL DEFAULT 0,
    "amountLeft" INTEGER NOT NULL DEFAULT 0,
    "purpose" TEXT NOT NULL,
    "campaignStatus" TEXT NOT NULL DEFAULT 'NEEDING',
    CONSTRAINT "campaigns_officialId_fkey" FOREIGN KEY ("officialId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Donations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amountRequired" INTEGER NOT NULL,
    "message" TEXT,
    "stripePaymentId" TEXT NOT NULL,
    "donationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "donatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Donations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_name_key" ON "campaigns"("name");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_officialId_key" ON "campaigns"("officialId");

-- CreateIndex
CREATE UNIQUE INDEX "Donations_stripePaymentId_key" ON "Donations"("stripePaymentId");
