import { getAllPosts } from "@/lib/posts";
import HomeClient from "@/components/home/HomeClient";

export default function Home() {
	const posts = getAllPosts();
	return <HomeClient posts={posts} />;
}
