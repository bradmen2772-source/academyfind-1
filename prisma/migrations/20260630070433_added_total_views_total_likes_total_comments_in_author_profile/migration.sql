-- AlterTable
ALTER TABLE "blog_author_profile" ADD COLUMN     "totalComments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalLikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalViews" INTEGER NOT NULL DEFAULT 0;
