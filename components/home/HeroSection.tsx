"use client";

import { useRef, useState, useEffect } from "react";
import TransitionLink from "@/components/motion/TransitionLink";
import { DiffusionText } from "@/components/motion/DiffusionText";
import { useTransition } from "@/components/motion/TransitionContext";

const HERO_PHRASES = [
  "Building",
  "Feeling",
  "Paving"
];

	const MAX_VOLUME = 0.35;
	const WHEEL_BARS = 21;

export function HeroSection() {
	const { phase } = useTransition();
	const transitioning = phase !== "idle";

	const [phraseIndex, setPhraseIndex] = useState(0);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	const HERO_AUDIO_STORAGE_KEY = "lmms.heroAudio.v1";
	const [volume, setVolume] = useState(0);
	const lastY = useRef<number | null>(null);
	
	useEffect(() => {
		if (transitioning) return;
		const interval = setInterval(() => {
			setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
		}, 18000);
		return () => clearInterval(interval);
	}, [transitioning]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(HERO_AUDIO_STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as unknown;
			if (!parsed || typeof parsed !== "object") return;
			const p = parsed as { volume?: unknown };
			if (typeof p.volume === "number" && Number.isFinite(p.volume)) {
				setVolume(Math.max(0, Math.min(MAX_VOLUME, p.volume)));
			}
		} catch {
			// ignore
		}
	}, []);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		video.volume = volume;
		video.muted = volume === 0;
	}, [volume]);

	function persistVolume(v: number) {
		try {
			localStorage.setItem(HERO_AUDIO_STORAGE_KEY, JSON.stringify({ volume: v }));
		} catch {
			// ignore
		}
	}

	function ensurePlayback() {
		const video = videoRef.current;
		if (!video) return;
		const p = video.play();
		if (p && typeof (p as Promise<void>).catch === "function") {
			(p as Promise<void>).catch(() => {});
		}
	}

	function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {
			// ignore
		}
		lastY.current = e.clientY;
	}

	function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
		if (e.buttons !== 1 || lastY.current === null) return;
		
		const deltaY = lastY.current - e.clientY;
		lastY.current = e.clientY;
		
		const sensitivity = 0.003;
		const newVol = Math.max(0, Math.min(MAX_VOLUME, volume + deltaY * sensitivity));
		
		setVolume(newVol);
		persistVolume(newVol);
		ensurePlayback();
	}

	function handlePointerUp() {
		lastY.current = null;
	}

	function toggleMute() {
		const newVol = volume === 0 ? MAX_VOLUME * 0.5 : 0;
		setVolume(newVol);
		persistVolume(newVol);
		ensurePlayback();
	}

	const currentPhrase = HERO_PHRASES[phraseIndex];
	const showSubtitle = currentPhrase === "Paving";
	const volumePct = Math.round((volume / MAX_VOLUME) * 100);
	const volumeReadout = String(volumePct).padStart(3, "0");
	const volumeNorm = Math.max(0, Math.min(1, volume / MAX_VOLUME));

	return (
		<div className="relative w-full overflow-hidden bg-[var(--background)]">
			<section className="brutalist-hero dashboard-hero">
			<div className="dashboard-panel hero-panel">
				
					<div className="brutalist-hero-content">
						<h1 className="brutalist-hero-title fade-in-up animate-fill-both">
							<div className="min-h-[1.2em]">
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
					<div className="hero-video-shell">
						<video
							autoPlay
							loop
							muted={volume === 0}
							playsInline
							preload="auto"
							className="hero-promo-video"
							aria-label="LMMS Lab promotional video"
							ref={videoRef}
						>
							<source src="/videos/hero-promo.mp4" type="video/mp4" />
						</video>

						<button
							type="button"
							className="hero-volume-btn"
							aria-label={
								volume === 0
									? "Sound muted - drag up to unmute"
									: `Volume ${Math.round((volume / MAX_VOLUME) * 100)}%`
							}
							onPointerDown={handlePointerDown}
							onPointerMove={handlePointerMove}
							onPointerUp={handlePointerUp}
							onPointerCancel={handlePointerUp}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									toggleMute();
								}
							}}
							onDoubleClick={(e) => {
								e.preventDefault();
								toggleMute();
							}}
						>
							<span className="hero-volume-core" aria-hidden="true">
								<span className="hero-volume-readout">{volumeReadout}</span>
								<span className="hero-volume-bars">
									{Array.from({ length: WHEEL_BARS }).map((_, idx) => {
										const center = (WHEEL_BARS - 1) / 2;
										const distFromCenter = Math.abs(idx - center);
										const t = center === 0 ? 0 : distFromCenter / center;
										const widthPercent = 28 + (1 - t ** 1.6) * 72;
										const threshold = 1 - (idx + 1) / WHEEL_BARS;
										const isOn = volumeNorm > threshold;
										const isCenter = idx === Math.floor(WHEEL_BARS / 2);
										const isMid = distFromCenter <= 2;

										return (
											<span
												key={idx}
												className={`hero-volume-bar${isOn ? " is-on" : ""}${isCenter ? " is-center" : ""}${isMid ? " is-mid" : ""}`}
												style={{ width: `${widthPercent}%` }}
											/>
										);
									})}
								</span>
							</span>
						</button>
					</div>
				</div>
				</div>
			</section>
		</div>
	);
}
