import { BlogCardPost } from "./BlogCard";

export interface BlogSearchDocument
    extends Omit<BlogCardPost, "publishedAt"> {

    publishedAt: number | null;

    prismaId: string;

    type: "blog";

    categorySlug: string | null;

    categoryName: string | null;

    tagSlugs: string[];

    tags: string[];

    authorUsername: string;

    content: string;

    name: string;

    url: string;
}