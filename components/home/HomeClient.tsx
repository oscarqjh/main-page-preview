"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CollectionSection } from "@/components/home/CollectionSection";
import OneVisionEncoderPreloader from "@/components/preload/OneVisionEncoderPreloader";
import type { Post } from "@/lib/posts";

const FEATURED_POST: Post = {
	slug: "onevision_encoder",
	title: "OneVision Encoder: Codec-Aligned Sparsity as a Foundational Principle for Multimodal Intelligence",
	description:
		"Our hypothesis: AGI is a compression problem. We introduce Codec Patchification that processes only 3.1%-25% of regions, achieving 4.1% improvement on video tasks while outperforming Qwen3-ViT and SigLIP2.",
	date: "2026-01-15T00:00:00.000Z",
	mainTags: ["models"],
	tags: ["models", "multimodal"],
	thumbnail: "/images/blog_thumbnails/onevision_encoder.png",
	content: "",
};

const RECENT_PINNED_SLUGS = [
	"llava_onevision_1_5",
	"longvt",
	"openmmreasoner",
];

interface HomeClientProps {
	posts: Post[];
}

export default function HomeClient({ posts }: HomeClientProps) {
	const postMap = new Map(posts.map((p) => [p.slug, p]));
	const recentPosts = RECENT_PINNED_SLUGS.map((slug) => postMap.get(slug)).filter(Boolean) as Post[];

	return (
		<div className="museum-home">
			<OneVisionEncoderPreloader />
			<HeroSection />

			<FeaturedSection featuredPost={FEATURED_POST} />

			<CollectionSection posts={recentPosts} />
		</div>
	);
}
