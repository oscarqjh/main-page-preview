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
	const KNOB_DETENTS = 24;
	const KNOB_SPIN_PX = 168;

export function HeroSection() {
	const { phase } = useTransition();
	const transitioning = phase !== "idle";

	const [phraseIndex, setPhraseIndex] = useState(0);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	const HERO_AUDIO_STORAGE_KEY = "lmms.heroAudio.v1";
	const [volume, setVolume] = useState(0);
	const [dragging, setDragging] = useState(false);
	const draggingRef = useRef(false);
	const lastY = useRef<number | null>(null);
	const volumeRef = useRef(0);

	useEffect(() => {
		volumeRef.current = volume;
	}, [volume]);
	
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
		draggingRef.current = true;
		setDragging(true);
		lastY.current = e.clientY;
	}

	function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
		if (!draggingRef.current || lastY.current === null) return;
		e.preventDefault();
		
		const deltaY = lastY.current - e.clientY;
		lastY.current = e.clientY;
		
		const sensitivity = 0.003;
		const newVol = Math.max(0, Math.min(MAX_VOLUME, volumeRef.current + deltaY * sensitivity));
		volumeRef.current = newVol;
		
		setVolume(newVol);
		persistVolume(newVol);
		ensurePlayback();
	}

	function handlePointerUp(e?: React.PointerEvent<HTMLButtonElement>) {
		draggingRef.current = false;
		setDragging(false);
		lastY.current = null;
		if (e) {
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch {
				// ignore
			}
		}
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
	const detentedNorm = Math.round(volumeNorm * KNOB_DETENTS) / KNOB_DETENTS;
	const grooveShift = Math.round(detentedNorm * KNOB_SPIN_PX);

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
							data-dragging={dragging ? "true" : "false"}
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
							<span className="hero-volume-knob" aria-hidden="true">
								<span className="hero-volume-knob-grooves" style={{ transform: `translateY(${grooveShift}px)` }} />
								<span className="hero-volume-knob-notch" />
							</span>
							<span className="hero-volume-readout" aria-hidden="true">
								{volumeReadout}
							</span>
						</button>
					</div>
				</div>
				</div>
			</section>
		</div>
	);
}
