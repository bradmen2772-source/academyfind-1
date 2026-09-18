-- DropForeignKey
ALTER TABLE "blog_post" DROP CONSTRAINT "blog_post_authorProfileId_fkey";

-- AlterTable
ALTER TABLE "institute_request" ADD COLUMN     "ownerDesignation" TEXT,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "ownerPhone" TEXT;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_authorProfileId_fkey" FOREIGN KEY ("authorProfileId") REFERENCES "blog_author_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
