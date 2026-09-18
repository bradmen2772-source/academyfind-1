import { meili } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function syncBlogPostToMeili(postId: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: {
        category: true,
        brand: true,
        tags: {
          include: {
            tag: true,
          },
        },
        authorProfile: true,
      },
    });

    if (!post) {
      console.warn(`Post ${postId} not found for Meilisearch sync.`);
      return;
    }

    // Only index published and public posts
    if (post.status !== "PUBLISHED" || post.visibility !== "PUBLIC") {
      // Remove it if it was previously indexed but now draft/private
      await deleteBlogPostFromMeili(postId);
      return;
    }

    const doc = {
      id: `blog-${post.id}`,
      prismaId: post.id,
      type: "blog",
      title: post.title,
      name: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: stripHtml(post.contentHtml ?? ""),
      categorySlug: post.category?.slug ?? null,
      categoryName: post.category?.name ?? null,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt,
      readingTime: post.readingTime,
      publishedAt: post.publishedAt?.getTime() ?? null,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      authorProfile: post.authorProfile
        ? {
            displayName: post.authorProfile.displayName,
            username: post.authorProfile.username,
            avatarUrl: post.authorProfile.avatarUrl,
            isVerified: post.authorProfile.isVerified,
          }
        : null,
      authorUsername: post.authorProfile?.username ?? null,
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
      brand: post.brand
        ? {
            id: post.brand.id,
            name: post.brand.name,
            slug: post.brand.slug,
            avatarUrl: post.brand.avatarUrl,
          }
        : null,
      tags: post.tags.map((t: any) => t.tag.name),
      tagSlugs: post.tags.map((t: any) => t.tag.slug),
      url: `/blog/${post.slug}`,
    };

    const index = meili.index("global_search");
    await index.addDocuments([doc]);
    console.log(`Successfully synced post ${post.id} to Meilisearch`);
  } catch (error) {
    console.error(`Error syncing blog post ${postId} to Meilisearch:`, error);
  }
}

export async function deleteBlogPostFromMeili(postId: string) {
  try {
    const index = meili.index("global_search");
    await index.deleteDocument(`blog-${postId}`);
    console.log(`Successfully deleted post ${postId} from Meilisearch`);
  } catch (error) {
    console.error(`Error deleting blog post ${postId} from Meilisearch:`, error);
  }
}
