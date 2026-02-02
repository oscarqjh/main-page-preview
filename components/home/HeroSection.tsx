"use client";

import { ParticleMorphWrapper } from "@/components/decorative";
import { GradientDither } from "@/components/decorative/GradientDither";
import MotionLink from "@/components/motion/MotionLink";
import { DiffusionText } from "@/components/motion/DiffusionText";
import { useState } from "react";

const HERO_TEXTS: Record<string, string> = {
	loss: "Feeling",
	waveform: "Sensing",
	lena: "Building",
	matrix: "Paving",
	attention: "Reasoning",
};

export function HeroSection() {
	const [morphState, setMorphState] = useState<string>("loss");
	const currentWord = HERO_TEXTS[morphState] || "Feeling";

	return (
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
						Advancing multimodal intelligence through open research. Models, data, and insights - shared as we discover.
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
	);
}
