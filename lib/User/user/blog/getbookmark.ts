import { BlogStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type GetBookmarkedPostsParams = {
  userId: string;
  page?: number;
  limit?: number;
};

export async function getBookmarkedPosts({
  userId,
  page = 1,
  limit = 9,
}: GetBookmarkedPostsParams) {
  if (!userId) {
    redirect("/login");
  }

  const where = {
    userId,
    post: {
      status: BlogStatus.PUBLISHED,
    },
  };

  const [bookmarks, total] = await Promise.all([
    prisma.blogBookmark.findMany({
      where,
      include: {
        post: {
          include: {
            category: true,
            brand: true,
            authorProfile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.blogBookmark.count({
      where,
    }),
  ]);

  const posts = bookmarks
    .map((bookmark: { post: any }) => bookmark.post)
    .filter((post: any): post is NonNullable<typeof post> => !!post);

  const totalPages = Math.ceil(total / limit);

  return {
    posts,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}