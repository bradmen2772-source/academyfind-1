-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'PREMIUM', 'ULTRA');

-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "gallery" TEXT[],
ADD COLUMN     "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'BASIC';

-- CreateTable
CREATE TABLE "institute_enquiry" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "institute_enquiry_instituteId_idx" ON "institute_enquiry"("instituteId");

-- AddForeignKey
ALTER TABLE "institute_enquiry" ADD CONSTRAINT "institute_enquiry_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
