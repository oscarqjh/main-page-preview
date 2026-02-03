"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/motion/TransitionLink";
import { DiffusionText } from "@/components/motion/DiffusionText";

const HERO_PHRASES = [
  "Building",
  "Feeling",
  "Paving"
];

export function HeroSection() {
	const [phraseIndex, setPhraseIndex] = useState(0);
	
	useEffect(() => {
		const interval = setInterval(() => {
			setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const currentPhrase = HERO_PHRASES[phraseIndex];
	const showSubtitle = currentPhrase === "Paving";

	return (
		<div className="relative w-full overflow-hidden bg-[var(--background)]">
			<section className="brutalist-hero dashboard-hero">
			<div className="dashboard-panel hero-panel">
				
					<div className="brutalist-hero-content">
						<h1 className="brutalist-hero-title fade-in-up animate-fill-both">
							<div className="min-h-[1.2em]">
								<DiffusionText 
									text={currentPhrase}
									revealSpeed={1200} 
									variant="morph"
									scrambleSpeed={80}
								/>
							</div>
							<span
								className={`brutalist-hero-title-sub mt-4 text-2xl font-normal lowercase transition-all duration-500 ${
									showSubtitle ? 'opacity-80' : 'opacity-0 pointer-events-none'
								}`}
							>
								the way to intelligence.
							</span>
						</h1>
						
						<p className="brutalist-hero-subtitle fade-in-up animate-fill-both stagger-1">
							Advancing multimodal intelligence through open research. Models, data, and insights - shared as we discover.
						</p>

						<div className="brutalist-hero-cta fade-in-up animate-fill-both stagger-2">
							<TransitionLink href="/posts" className="brutalist-btn-primary">
								Explore Research
							</TransitionLink>
							<TransitionLink href="/about" className="brutalist-btn-secondary">
								About the Lab
							</TransitionLink>
						</div>
					</div>
				</div>

			<div className="dashboard-panel hero-panel hero-panel-visual">
				
					<div className="brutalist-hero-visual fade-in animate-fill-both stagger-2">
						<video
							autoPlay
							loop
							muted
							playsInline
							className="hero-promo-video"
							aria-label="LMMS Lab promotional video"
						>
							<source src="/videos/hero-promo.mp4" type="video/mp4" />
						</video>
					</div>
				</div>
			</section>
		</div>
	);
}
