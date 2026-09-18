import BlogCard from "../cards/BlogCard";
import { BlogCardPost } from "@/types/BlogCard";

type Props = {
  posts: BlogCardPost[];
};

export default function SearchResultGrid({ posts }: Props) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post: BlogCardPost) => (
        <BlogCard
          key={post.id}
          post={post}
        />
      ))}
    </section>
  );
}