"use client";

import { GradientDither } from "@/components/decorative/GradientDither";
import { AnimatedCircuit } from "@/components/blog/AnimatedCircuit";
import MotionLink from "@/components/motion/MotionLink";
import type { Post } from "@/lib/posts";

interface FeaturedSectionProps {
	featuredPost: Post;
}

export function FeaturedSection({ featuredPost }: FeaturedSectionProps) {
	if (!featuredPost) return null;

	return (
		<section className="museum-featured">
			<div className="museum-section-header">
				<span className="museum-section-label">Featured Research</span>
				<div className="museum-section-line" />
			</div>

			<MotionLink 
				href={`/posts/${featuredPost.slug}`} 
				className="museum-featured-card card-lift relative group"
				style={{ width: '100%', display: 'block' }}
			>
				<GradientDither 
					opacity={0} 
					direction="to-bottom-right" 
					className="transition-opacity duration-500 group-hover:opacity-10 mix-blend-overlay z-0"
				/>
				<div className="museum-featured-image relative z-10">
					<AnimatedCircuit seed={featuredPost.slug} className="absolute inset-0 w-full h-full" />
				</div>
				<div className="museum-featured-content relative z-10">
					<time className="museum-featured-date">
						{new Date(featuredPost.date).toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						}).toUpperCase()}
					</time>
					<h2 className="museum-featured-title">{featuredPost.title}</h2>
					{featuredPost.description && (
						<p className="museum-featured-desc">{featuredPost.description}</p>
					)}
					<div className="museum-featured-tags">
						{featuredPost.mainTags?.map((tag) => (
							<span key={tag} className="museum-tag">{tag}</span>
						))}
					</div>
					
					<div className="mt-6">
						<span className="museum-btn-secondary">
							Read Paper
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</span>
					</div>
				</div>
			</MotionLink>
		</section>
	);
}
