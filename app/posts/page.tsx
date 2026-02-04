import { getAllPosts } from "@/lib/posts";
import { PostsClient } from "./PostsClient";

export const metadata = {
	title: "Posts - LMMs-Lab",
	description: "Blog posts from LMMs-Lab research team",
};

export default function PostsPage() {
	const posts = getAllPosts();
	return <PostsClient posts={posts} />;
}
