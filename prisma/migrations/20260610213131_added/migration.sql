-- AlterEnum
ALTER TYPE "SubscriptionPlan" ADD VALUE 'VERIFIED';

-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "youtubeVideos" TEXT[];

-- CreateTable
CREATE TABLE "teacher_profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT,
    "experience" TEXT,
    "imageUrl" TEXT,
    "instituteId" TEXT NOT NULL,

    CONSTRAINT "teacher_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teacher_profile_instituteId_idx" ON "teacher_profile"("instituteId");

-- AddForeignKey
ALTER TABLE "teacher_profile" ADD CONSTRAINT "teacher_profile_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
