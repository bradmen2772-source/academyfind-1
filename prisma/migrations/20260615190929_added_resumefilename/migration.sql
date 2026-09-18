/*
  Warnings:

  - Added the required column `resumeFileName` to the `job_application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_application" ADD COLUMN     "resumeFileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "job_posting" ALTER COLUMN "benefits" DROP NOT NULL;
