-- AlterTable
ALTER TABLE "institute_enquiry" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "isForwarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT;
