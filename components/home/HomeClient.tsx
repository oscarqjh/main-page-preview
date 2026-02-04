"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CollectionSection } from "@/components/home/CollectionSection";
import type { Post } from "@/lib/posts";

const PINNED_SLUGS = [
	"onevision_encoder",
	"llava_onevision_1_5",
	"longvt",
	"openmmreasoner",
];

interface HomeClientProps {
  posts: Post[];
}

export default function HomeClient({ posts }: HomeClientProps) {
	const postMap = new Map(posts.map((p) => [p.slug, p]));
	const pinned = PINNED_SLUGS.map((slug) => postMap.get(slug)).filter(Boolean) as Post[];

	const featuredPost = pinned[0];
	const recentPosts = pinned.slice(1, 4);

	return (
		<div className="museum-home">
			<HeroSection />

			<FeaturedSection featuredPost={featuredPost} />

			<CollectionSection posts={recentPosts} />
		</div>
	);
}
