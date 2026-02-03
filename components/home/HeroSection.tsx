"use client";

import { GradientDither } from "@/components/decorative/GradientDither";
import MotionLink from "@/components/motion/MotionLink";
import { DiffusionText } from "@/components/motion/DiffusionText";

export function HeroSection() {
	return (
		<div className="relative w-full overflow-hidden bg-[var(--background)]">
			<GradientDither 
				opacity={0.15} 
				direction="to-bottom-right" 
				className="mix-blend-overlay"
			/>
			<section className="brutalist-hero dashboard-hero">
			<div className="dashboard-panel hero-panel">
				
					<div className="brutalist-hero-content">
						<h1 className="brutalist-hero-title fade-in-up animate-fill-both">
							<div className="min-h-[1.2em]">
								<DiffusionText 
									text="Building" 
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
