import { prisma } from "@/lib/prisma";

export async function getAuthorByUsername(username: string) {
  try {
    if (!username) return null;

    const author = await prisma.blogAuthorProfile.findUnique({
      where: {
        username,
        isActive: true,
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatarUrl: true,
        bio: true,
        designation: true,
        experience: true,
        specialization: true,
        websiteUrl: true,
        twitterUrl: true,
        linkedinUrl: true,
        followerCount: true,
        isVerified: true,
        createdAt: true,
        metaDescription: true,
        metaTitle: true,

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

            category: {
              select: {
                id: true,
                name: true,
                slug: true,
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

    if (!author) {
      return null;
    }

    const totalViews = author.posts.reduce(
      (sum: number, post: any) => sum + post.viewCount,
      0
    );

    const totalLikes = author.posts.reduce(
      (sum: number, post: any) => sum + post.likeCount,
      0
    );

    const totalComments = author.posts.reduce(
      (sum: number, post: any) => sum + post.commentCount,
      0
    );

    return {
      ...author,
      totalPosts: author.posts.length,
      totalViews,
      totalLikes,
      totalComments,
    };
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
}