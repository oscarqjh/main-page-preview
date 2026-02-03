"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CollectionSection } from "@/components/home/CollectionSection";
import type { Post } from "@/lib/posts";

interface HomeClientProps {
  posts: Post[];
}

export default function HomeClient({ posts }: HomeClientProps) {
	const featuredPost = posts[0];
	const recentPosts = posts.slice(1, 4);

	return (
		<div className="museum-home">
			<HeroSection />

			<FeaturedSection featuredPost={featuredPost} />

			<CollectionSection posts={recentPosts} />
		</div>
	);
}
