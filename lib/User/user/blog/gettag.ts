import { prisma } from "@/lib/prisma";

export async function getTagBySlug(slug: string) {
  try {
    if (!slug) {
      return null;
    }

    const tag = await prisma.blogTag.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,

        postCount: true,

        createdAt: true,
        updatedAt: true,

        posts: {
          where: {
            post: {
              status: "PUBLISHED",
              visibility: "PUBLIC",
            },
          },
          orderBy: {
            post: {
              publishedAt: "desc",
            },
          },
          select: {
            post: {
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
        },
      },
    });

    if (!tag) {
      return null;
    }

    const posts = tag.posts.map((item: { post: any }) => item.post);

    const totalViews = posts.reduce(
      (sum: number, post: any) => sum + post.viewCount,
      0
    );

    const totalLikes = posts.reduce(
      (sum: number, post: any) => sum + post.likeCount,
      0
    );

    const totalComments = posts.reduce(
      (sum: number, post: any) => sum + post.commentCount,
      0
    );

    return {
      ...tag,
      posts,
      totalViews,
      totalLikes,
      totalComments,
    };
  } catch (error) {
    console.error("Error fetching blog tag:", error);
    return null;
  }
}