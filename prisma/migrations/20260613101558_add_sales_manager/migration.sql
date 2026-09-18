-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NOT_CONTACTED', 'CONTACTED', 'ONBOARDED');

-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('INTERESTED', 'NOT_INTERESTED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SALES_MANAGER';

-- CreateTable
CREATE TABLE "sales_assignment" (
    "id" TEXT NOT NULL,
    "salesManagerId" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "contactStatus" "ContactStatus" NOT NULL DEFAULT 'NOT_CONTACTED',
    "interest" "InterestStatus",
    "remark" TEXT,
    "onboardedPlan" "SubscriptionPlan",
    "deadline" TIMESTAMP(3),
    "contactedAt" TIMESTAMP(3),
    "onboardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_category_assignment" (
    "id" TEXT NOT NULL,
    "salesManagerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_category_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sales_assignment_salesManagerId_idx" ON "sales_assignment"("salesManagerId");

-- CreateIndex
CREATE INDEX "sales_assignment_instituteId_idx" ON "sales_assignment"("instituteId");

-- CreateIndex
CREATE INDEX "sales_assignment_contactStatus_idx" ON "sales_assignment"("contactStatus");

-- CreateIndex
CREATE UNIQUE INDEX "sales_assignment_salesManagerId_instituteId_key" ON "sales_assignment"("salesManagerId", "instituteId");

-- CreateIndex
CREATE INDEX "sales_category_assignment_salesManagerId_idx" ON "sales_category_assignment"("salesManagerId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_category_assignment_salesManagerId_categoryId_key" ON "sales_category_assignment"("salesManagerId", "categoryId");

-- AddForeignKey
ALTER TABLE "sales_assignment" ADD CONSTRAINT "sales_assignment_salesManagerId_fkey" FOREIGN KEY ("salesManagerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_assignment" ADD CONSTRAINT "sales_assignment_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_category_assignment" ADD CONSTRAINT "sales_category_assignment_salesManagerId_fkey" FOREIGN KEY ("salesManagerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_category_assignment" ADD CONSTRAINT "sales_category_assignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
