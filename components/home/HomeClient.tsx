"use client";

import { PixelDivider, ParticleMorphWrapper, TechContainer } from "@/components/decorative";
import { GradientDither } from "@/components/decorative/GradientDither";
import { PostThumbnail } from "@/components/blog/PostThumbnail";
import { AnimatedCircuit } from "@/components/blog/AnimatedCircuit";
import MotionLink from "@/components/motion/MotionLink";
import { DiffusionText } from "@/components/motion/DiffusionText";
import { useState } from "react";
import type { Post } from "@/lib/posts";

interface HomeClientProps {
  posts: Post[];
}

const HERO_TEXTS: Record<string, string> = {
	loss: "Feeling",
	waveform: "Sensing",
	lena: "Building",
	matrix: "Paving",
	attention: "Reasoning",
};

export default function HomeClient({ posts }: HomeClientProps) {
	const featuredPost = posts[0];
	const recentPosts = posts.slice(1, 4);
	const [morphState, setMorphState] = useState<string>("loss");

	const currentWord = HERO_TEXTS[morphState] || "Feeling";

	return (
		<div className="museum-home">
			<div className="relative w-full overflow-hidden bg-[var(--background)]">
				<GradientDither 
					opacity={0.15} 
					direction="to-bottom-right" 
					className="mix-blend-overlay"
				/>
				<section className="brutalist-hero">
					<div className="brutalist-hero-content">
					<h1 className="brutalist-hero-title fade-in-up animate-fill-both">
						<div key={currentWord} className="min-h-[1.2em]">
							<DiffusionText 
								text={currentWord} 
								revealSpeed={1200} 
								variant="morph"
								scrambleSpeed={80}
							/>
						</div>
						<span className="brutalist-hero-title-sub mt-4 text-2xl font-normal opacity-80 lowercase">
							the way to intelligence.
						</span>
					</h1>
					
					<p className="brutalist-hero-subtitle fade-in-up animate-fill-both stagger-1">
						Open-sourcing everything as we can, share the principal insights as we discover.
					</p>

					<div className="brutalist-hero-cta fade-in-up animate-fill-both stagger-2">
						<MotionLink href="/posts" className="brutalist-btn-primary">
							Explore Research
						</MotionLink>
						<MotionLink href="/about" className="brutalist-btn-secondary">
							About the Lab
						</MotionLink>
					</div>
				</div>

				<div className="brutalist-hero-visual fade-in animate-fill-both stagger-2">
					<ParticleMorphWrapper onStateChange={setMorphState} />
				</div>
				</section>
			</div>

			<PixelDivider variant="dashed" />

			{featuredPost && (
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
			)}

			<section className="museum-collection">
				<div className="museum-section-header">
					<span className="museum-section-label">Latest Publications</span>
					<div className="museum-section-line" />
					<MotionLink href="/posts" className="museum-view-all">
						View Archive
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</MotionLink>
				</div>

				<div className="museum-grid">
					{recentPosts.map((post, index) => (
						<MotionLink 
							key={post.slug} 
							href={`/posts/${post.slug}`} 
							className="museum-card card-lift"
						>
							<TechContainer className="h-full flex flex-col p-0! border-none!" label={`[${String(index + 1).padStart(2, '0')}]`}>
								<div className="museum-card-image">
									<PostThumbnail title={post.title} seed={post.slug} />
								</div>
								<div className="museum-card-content">
									<time className="museum-card-date">
										{new Date(post.date).toLocaleDateString("en-US", {
											month: "short",
											year: "numeric",
										}).toUpperCase()}
									</time>
									<h3 className="museum-card-title">{post.title}</h3>
									{post.mainTags?.[0] && (
										<span className="museum-card-tag">{post.mainTags[0]}</span>
									)}
								</div>
							</TechContainer>
						</MotionLink>
					))}
				</div>
			</section>

			<section className="museum-stats">
				<div className="museum-stats-grid">
					<div className="museum-stat">
						<span className="museum-stat-number">16+</span>
						<span className="museum-stat-label">Publications</span>
					</div>
					<div className="museum-stat-divider" />
					<div className="museum-stat">
						<span className="museum-stat-number">50+</span>
						<span className="museum-stat-label">Contributors</span>
					</div>
					<div className="museum-stat-divider" />
					<div className="museum-stat">
						<span className="museum-stat-number">∞</span>
						<span className="museum-stat-label">Possibilities</span>
					</div>
				</div>
			</section>

			<section className="museum-quote">
				<blockquote>
					"Quiet assets, loud impact."
				</blockquote>
				<p className="museum-quote-sub">
					We build with intention, not noise.
				</p>
			</section>
		</div>
	);
}
