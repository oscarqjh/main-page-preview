"use client";

import { PixelDivider } from "@/components/decorative";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CollectionSection } from "@/components/home/CollectionSection";
import { StatsSection } from "@/components/home/StatsSection";
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

			<PixelDivider variant="dashed" />

			<FeaturedSection featuredPost={featuredPost} />

			<CollectionSection posts={recentPosts} />

			<StatsSection />

			<section className="museum-quote">
				<blockquote>
					&quot;Quiet assets, loud impact.&quot;
				</blockquote>
				<p className="museum-quote-sub">
					We build with intention, not noise.
				</p>
			</section>
		</div>
	);
}
