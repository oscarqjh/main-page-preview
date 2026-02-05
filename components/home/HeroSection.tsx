"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/motion/TransitionLink";
import { DiffusionText } from "@/components/motion/DiffusionText";
import { useTransition } from "@/components/motion/TransitionSystem";
import { HackerTerminal } from "./HackerTerminal";

const HERO_PHRASES = [
  "Building",
  "Feeling",
  "Paving"
];

export function HeroSection() {
	const { phase } = useTransition();
	const transitioning = phase !== "idle";

	const [phraseIndex, setPhraseIndex] = useState(0);
	
	useEffect(() => {
		if (transitioning) return;
		const interval = setInterval(() => {
			setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
		}, 28000);
		return () => clearInterval(interval);
	}, [transitioning]);

	const currentPhrase = HERO_PHRASES[phraseIndex];
	const showSubtitle = currentPhrase === "Paving";

	return (
		<div className="relative w-full overflow-hidden bg-[var(--background)]">
			<section className="brutalist-hero dashboard-hero">
			<div className="dashboard-panel hero-panel">
				
					<div className="brutalist-hero-content">
						<h1 className="brutalist-hero-title fade-in-up animate-fill-both">
							<div className="min-h-[1.2em] overflow-hidden" style={{ whiteSpace: "nowrap" }}>
							<DiffusionText 
								text={currentPhrase}
								revealSpeed={4000} 
								variant="morph"
								paused={transitioning}
							/>
							</div>
							<span
								className={`brutalist-hero-title-sub lowercase ${
									showSubtitle ? '' : 'hidden-sub'
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
					<div className="hero-terminal-shell">
						<HackerTerminal />
					</div>
				</div>
				</div>
			</section>
		</div>
	);
}
