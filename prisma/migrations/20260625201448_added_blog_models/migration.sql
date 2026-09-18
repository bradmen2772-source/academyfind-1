/*
  Warnings:

  - The values [CONTENT_WRITER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'SCHEDULED', 'PUBLISHED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlogVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'HELPFUL', 'INSIGHTFUL', 'LOVE');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'MISINFORMATION', 'COPYRIGHT', 'HARASSMENT', 'OFFENSIVE', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'INSTITUTE_MANAGER', 'ADMIN', 'SALES_MANAGER');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "canWriteBlogs" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "blog_author_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "designation" TEXT,
    "experience" INTEGER,
    "specialization" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "twitterUrl" TEXT,
    "linkedinUrl" TEXT,
    "websiteUrl" TEXT,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_author_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "coverImage" TEXT,
    "metaImage" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "blog_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "contentMarkdown" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "searchDocument" TEXT,
    "coverImage" TEXT,
    "coverImageAlt" TEXT,
    "coverImageWidth" INTEGER,
    "coverImageHeight" INTEGER,
    "readingTime" INTEGER,
    "wordCount" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedVersion" INTEGER,
    "featuredUntil" TIMESTAMP(3),
    "authorProfileId" TEXT NOT NULL,
    "categoryId" TEXT,
    "relatedInstituteId" TEXT,
    "brandId" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "BlogVisibility" NOT NULL DEFAULT 'PUBLIC',
    "rejectionReason" TEXT,
    "reviewedById" TEXT,
    "publishedById" TEXT,
    "lastEditedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "focusKeyword" TEXT,
    "tableOfContents" JSONB,
    "canonicalUrl" TEXT,
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "ogImage" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredOrder" INTEGER NOT NULL DEFAULT 0,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_slug_history" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "oldSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_slug_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_revision" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "coverImage" TEXT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "contentMarkdown" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_view" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "ipHash" TEXT,
    "sessionId" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "operatingSystem" TEXT,
    "country" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_author_follower" (
    "id" TEXT NOT NULL,
    "authorProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_author_follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationToken" TEXT,
    "unsubscribeToken" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_report" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "message" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,

    CONSTRAINT "blog_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_tag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "blog_post_tag_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "blog_comment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_reaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_faq" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "blog_faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_author_profile_userId_key" ON "blog_author_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_author_profile_username_key" ON "blog_author_profile"("username");

-- CreateIndex
CREATE INDEX "blog_author_profile_username_idx" ON "blog_author_profile"("username");

-- CreateIndex
CREATE INDEX "blog_author_profile_isActive_idx" ON "blog_author_profile"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "blog_category_name_key" ON "blog_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_category_slug_key" ON "blog_category"("slug");

-- CreateIndex
CREATE INDEX "blog_category_slug_idx" ON "blog_category"("slug");

-- CreateIndex
CREATE INDEX "blog_category_order_idx" ON "blog_category"("order");

-- CreateIndex
CREATE INDEX "blog_category_isActive_idx" ON "blog_category"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tag_name_key" ON "blog_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tag_slug_key" ON "blog_tag"("slug");

-- CreateIndex
CREATE INDEX "blog_tag_slug_idx" ON "blog_tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_slug_key" ON "blog_post"("slug");

-- CreateIndex
CREATE INDEX "blog_post_slug_idx" ON "blog_post"("slug");

-- CreateIndex
CREATE INDEX "blog_post_slug_status_idx" ON "blog_post"("slug", "status");

-- CreateIndex
CREATE INDEX "blog_post_status_idx" ON "blog_post"("status");

-- CreateIndex
CREATE INDEX "blog_post_publishedAt_idx" ON "blog_post"("publishedAt");

-- CreateIndex
CREATE INDEX "blog_post_status_publishedAt_idx" ON "blog_post"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_post_categoryId_status_publishedAt_idx" ON "blog_post"("categoryId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_post_authorProfileId_idx" ON "blog_post"("authorProfileId");

-- CreateIndex
CREATE INDEX "blog_post_brandId_idx" ON "blog_post"("brandId");

-- CreateIndex
CREATE INDEX "blog_post_relatedInstituteId_idx" ON "blog_post"("relatedInstituteId");

-- CreateIndex
CREATE INDEX "blog_post_relatedInstituteId_status_idx" ON "blog_post"("relatedInstituteId", "status");

-- CreateIndex
CREATE INDEX "blog_post_isFeatured_featuredOrder_idx" ON "blog_post"("isFeatured", "featuredOrder");

-- CreateIndex
CREATE INDEX "blog_post_createdAt_idx" ON "blog_post"("createdAt");

-- CreateIndex
CREATE INDEX "blog_post_status_createdAt_idx" ON "blog_post"("status", "createdAt");

-- CreateIndex
CREATE INDEX "blog_post_authorProfileId_status_idx" ON "blog_post"("authorProfileId", "status");

-- CreateIndex
CREATE INDEX "blog_post_categoryId_createdAt_idx" ON "blog_post"("categoryId", "createdAt");

-- CreateIndex
CREATE INDEX "blog_post_status_visibility_idx" ON "blog_post"("status", "visibility");

-- CreateIndex
CREATE UNIQUE INDEX "blog_slug_history_oldSlug_key" ON "blog_slug_history"("oldSlug");

-- CreateIndex
CREATE INDEX "blog_slug_history_postId_idx" ON "blog_slug_history"("postId");

-- CreateIndex
CREATE INDEX "blog_slug_history_oldSlug_idx" ON "blog_slug_history"("oldSlug");

-- CreateIndex
CREATE INDEX "blog_revision_postId_idx" ON "blog_revision"("postId");

-- CreateIndex
CREATE INDEX "blog_revision_version_idx" ON "blog_revision"("version");

-- CreateIndex
CREATE INDEX "blog_revision_createdById_idx" ON "blog_revision"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "blog_revision_postId_version_key" ON "blog_revision"("postId", "version");

-- CreateIndex
CREATE INDEX "blog_view_postId_idx" ON "blog_view"("postId");

-- CreateIndex
CREATE INDEX "blog_view_userId_idx" ON "blog_view"("userId");

-- CreateIndex
CREATE INDEX "blog_view_viewedAt_idx" ON "blog_view"("viewedAt");

-- CreateIndex
CREATE INDEX "blog_bookmark_userId_idx" ON "blog_bookmark"("userId");

-- CreateIndex
CREATE INDEX "blog_bookmark_postId_idx" ON "blog_bookmark"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_bookmark_userId_postId_key" ON "blog_bookmark"("userId", "postId");

-- CreateIndex
CREATE INDEX "blog_author_follower_authorProfileId_idx" ON "blog_author_follower"("authorProfileId");

-- CreateIndex
CREATE INDEX "blog_author_follower_userId_idx" ON "blog_author_follower"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_author_follower_authorProfileId_userId_key" ON "blog_author_follower"("authorProfileId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_subscriber_email_key" ON "blog_subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "blog_subscriber_verificationToken_key" ON "blog_subscriber"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "blog_subscriber_unsubscribeToken_key" ON "blog_subscriber"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "blog_subscriber_email_idx" ON "blog_subscriber"("email");

-- CreateIndex
CREATE INDEX "blog_subscriber_isActive_idx" ON "blog_subscriber"("isActive");

-- CreateIndex
CREATE INDEX "blog_subscriber_createdAt_idx" ON "blog_subscriber"("createdAt");

-- CreateIndex
CREATE INDEX "blog_report_postId_idx" ON "blog_report"("postId");

-- CreateIndex
CREATE INDEX "blog_report_userId_idx" ON "blog_report"("userId");

-- CreateIndex
CREATE INDEX "blog_report_status_idx" ON "blog_report"("status");

-- CreateIndex
CREATE INDEX "blog_report_createdAt_idx" ON "blog_report"("createdAt");

-- CreateIndex
CREATE INDEX "blog_report_resolvedById_idx" ON "blog_report"("resolvedById");

-- CreateIndex
CREATE INDEX "blog_post_tag_tagId_idx" ON "blog_post_tag"("tagId");

-- CreateIndex
CREATE INDEX "blog_comment_postId_idx" ON "blog_comment"("postId");

-- CreateIndex
CREATE INDEX "blog_comment_userId_idx" ON "blog_comment"("userId");

-- CreateIndex
CREATE INDEX "blog_comment_parentId_idx" ON "blog_comment"("parentId");

-- CreateIndex
CREATE INDEX "blog_comment_status_idx" ON "blog_comment"("status");

-- CreateIndex
CREATE INDEX "blog_comment_createdAt_idx" ON "blog_comment"("createdAt");

-- CreateIndex
CREATE INDEX "blog_comment_postId_status_idx" ON "blog_comment"("postId", "status");

-- CreateIndex
CREATE INDEX "blog_reaction_postId_idx" ON "blog_reaction"("postId");

-- CreateIndex
CREATE INDEX "blog_reaction_userId_idx" ON "blog_reaction"("userId");

-- CreateIndex
CREATE INDEX "blog_reaction_type_idx" ON "blog_reaction"("type");

-- CreateIndex
CREATE UNIQUE INDEX "blog_reaction_postId_userId_key" ON "blog_reaction"("postId", "userId");

-- CreateIndex
CREATE INDEX "blog_faq_postId_idx" ON "blog_faq"("postId");

-- CreateIndex
CREATE INDEX "blog_faq_order_idx" ON "blog_faq"("order");

-- CreateIndex
CREATE UNIQUE INDEX "blog_brand_slug_key" ON "blog_brand"("slug");

-- CreateIndex
CREATE INDEX "blog_brand_slug_idx" ON "blog_brand"("slug");

-- AddForeignKey
ALTER TABLE "blog_author_profile" ADD CONSTRAINT "blog_author_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_authorProfileId_fkey" FOREIGN KEY ("authorProfileId") REFERENCES "blog_author_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_relatedInstituteId_fkey" FOREIGN KEY ("relatedInstituteId") REFERENCES "Institute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "blog_brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_slug_history" ADD CONSTRAINT "blog_slug_history_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_revision" ADD CONSTRAINT "blog_revision_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_revision" ADD CONSTRAINT "blog_revision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_view" ADD CONSTRAINT "blog_view_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_view" ADD CONSTRAINT "blog_view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_bookmark" ADD CONSTRAINT "blog_bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_bookmark" ADD CONSTRAINT "blog_bookmark_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_author_follower" ADD CONSTRAINT "blog_author_follower_authorProfileId_fkey" FOREIGN KEY ("authorProfileId") REFERENCES "blog_author_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_author_follower" ADD CONSTRAINT "blog_author_follower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_report" ADD CONSTRAINT "blog_report_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_report" ADD CONSTRAINT "blog_report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_report" ADD CONSTRAINT "blog_report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_tag" ADD CONSTRAINT "blog_post_tag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_tag" ADD CONSTRAINT "blog_post_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "blog_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "blog_comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_reaction" ADD CONSTRAINT "blog_reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_reaction" ADD CONSTRAINT "blog_reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_faq" ADD CONSTRAINT "blog_faq_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
