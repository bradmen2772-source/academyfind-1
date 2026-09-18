import { prisma } from "@/lib/prisma";

export async function getCategoryBySlug(slug: string) {
  try {
    if (!slug) {
      return null;
    }

    const category = await prisma.blogCategory.findUnique({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        coverImage: true,

        metaTitle: true,
        metaDescription: true,
        postCount: true,

        createdAt: true,

        posts: {
          where: {
            status: "PUBLISHED",
            visibility: "PUBLIC",
          },
          orderBy: {
            publishedAt: "desc",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,

            coverImage: true,
            coverImageAlt: true,

            readingTime: true,
            publishedAt: true,

            viewCount: true,
            likeCount: true,
            commentCount: true,

            authorProfile: {
              select: {
                displayName: true,
                username: true,
                avatarUrl: true,
                isVerified: true,
              },
            },

            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    const totalViews = category.posts.reduce(
      (sum: number, post: any) => sum + post.viewCount,
      0
    );

    const totalLikes = category.posts.reduce(
      (sum: number, post: any) => sum + post.likeCount,
      0
    );

    const totalComments = category.posts.reduce(
      (sum: number, post: any) => sum + post.commentCount,
      0
    );

    return {
      ...category,
      totalViews,
      totalLikes,
      totalComments,
    };
  } catch (error) {
    console.error("Error fetching blog category:", error);
    return null;
  }
}