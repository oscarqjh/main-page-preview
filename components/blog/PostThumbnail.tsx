"use client";

import { useMemo } from "react";

interface PostThumbnailProps {
	title: string;
	seed?: string;
	className?: string;
}

function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
}

function seededRandom(seed: number): number {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

export function PostThumbnail({
	title,
	seed,
	className = "",
}: PostThumbnailProps) {
	const hash = useMemo(() => hashString(seed || title), [seed, title]);
	
	const variant = hash % 5;
	
	const shortTitle = title.length > 40 ? title.slice(0, 37) + "..." : title;

	return (
		<div className={`post-thumbnail-v2 ${className}`}>
			<div className="post-thumbnail-v2-bg">
				{variant === 0 && <HalftonePortrait hash={hash} />}
				{variant === 1 && <CircuitGrid hash={hash} />}
				{variant === 2 && <DataBlocks hash={hash} />}
				{variant === 3 && <WaveformDisplay hash={hash} />}
				{variant === 4 && <AbstractFigure hash={hash} />}
			</div>
			<div className="post-thumbnail-v2-overlay" />
			<div className="post-thumbnail-v2-content">
				<span className="post-thumbnail-v2-title">{shortTitle}</span>
			</div>
		</div>
	);
}

function HalftonePortrait({ hash }: { hash: number }) {
	const blocks = useMemo(() => {
		const elements: JSX.Element[] = [];
		const cols = 24;
		const rows = 18;

		const centerX = 12 + (seededRandom(hash) - 0.5) * 6;
		const centerY = 9 + (seededRandom(hash + 1) - 0.5) * 4;
		const headRadius = 5 + seededRandom(hash + 2) * 2;
		const bodyWidth = 8 + seededRandom(hash + 3) * 4;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const x = (col + 0.5) * (100 / cols);
				const y = (row + 0.5) * (100 / rows);

				const distToHead = Math.sqrt(
					Math.pow((col - centerX) / headRadius, 2) +
					Math.pow((row - centerY + 2) / headRadius, 2)
				);

				const inBody = row > centerY + 1 &&
					Math.abs(col - centerX) < bodyWidth / 2 * (1 + (row - centerY) * 0.15);

				let size = 0;
				if (distToHead < 1) {
					size = (1 - distToHead) * 3 + seededRandom(hash + row * cols + col) * 0.8;
				} else if (inBody) {
					const bodyDist = Math.abs(col - centerX) / (bodyWidth / 2);
					size = (1 - bodyDist * 0.5) * 2.5 + seededRandom(hash + row * cols + col + 100) * 0.5;
				} else {
					if (seededRandom(hash + row * cols + col + 200) > 0.85) {
						size = seededRandom(hash + row * cols + col + 300) * 1.5;
					}
				}

				if (size > 0.3) {
					const s = size * 2;
					elements.push(
						<rect
							key={`${row}-${col}`}
							x={x - s / 2}
							y={y - s / 2}
							width={s}
							height={s}
							fill="currentColor"
							style={{ animationDelay: `${((row + col) % 10) * 0.15}s` }}
						/>
					);
				}
			}
		}
		return elements;
	}, [hash]);

	return (
		<svg className="post-thumbnail-v2-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
			{blocks}
		</svg>
	);
}

function CircuitGrid({ hash }: { hash: number }) {
	const elements = useMemo(() => {
		const items: JSX.Element[] = [];
		const gridSize = 6;
		
		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const x = col * (100 / gridSize) + 100 / gridSize / 2;
				const y = row * (100 / gridSize) + 100 / gridSize / 2;
				const cellSeed = hash + row * gridSize + col;
				
				if (seededRandom(cellSeed) > 0.3) {
					const nodeSize = seededRandom(cellSeed + 100) * 4 + 2;
					items.push(
						<rect
							key={`node-${row}-${col}`}
							x={x - nodeSize / 2}
							y={y - nodeSize / 2}
							width={nodeSize}
							height={nodeSize}
							fill="currentColor"
							style={{ animationDelay: `${(row + col) * 0.1}s` }}
						/>
					);
				}
				
				if (seededRandom(cellSeed + 200) > 0.5 && col < gridSize - 1) {
					const nextX = (col + 1) * (100 / gridSize) + 100 / gridSize / 2;
					items.push(
						<line
							key={`h-${row}-${col}`}
							x1={x}
							y1={y}
							x2={nextX}
							y2={y}
							stroke="currentColor"
							strokeWidth="1"
							opacity="0.6"
						/>
					);
				}
				
				if (seededRandom(cellSeed + 300) > 0.5 && row < gridSize - 1) {
					const nextY = (row + 1) * (100 / gridSize) + 100 / gridSize / 2;
					items.push(
						<line
							key={`v-${row}-${col}`}
							x1={x}
							y1={y}
							x2={x}
							y2={nextY}
							stroke="currentColor"
							strokeWidth="1"
							opacity="0.6"
						/>
					);
				}
			}
		}
		
		const numCircuits = 3 + Math.floor(seededRandom(hash + 500) * 3);
		for (let i = 0; i < numCircuits; i++) {
			const startX = seededRandom(hash + i * 10 + 600) * 80 + 10;
			const startY = seededRandom(hash + i * 10 + 700) * 80 + 10;
			const endX = seededRandom(hash + i * 10 + 800) * 80 + 10;
			const endY = seededRandom(hash + i * 10 + 900) * 80 + 10;
			const midX = startX + (endX - startX) * 0.5;
			
			items.push(
				<path
					key={`circuit-${i}`}
					d={`M${startX},${startY} L${midX},${startY} L${midX},${endY} L${endX},${endY}`}
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					opacity="0.8"
				/>
			);
		}
		
		return items;
	}, [hash]);

	return (
		<svg className="post-thumbnail-v2-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
			{elements}
		</svg>
	);
}

function DataBlocks({ hash }: { hash: number }) {
	const blocks = useMemo(() => {
		const items: JSX.Element[] = [];
		const blockGroups = 2 + Math.floor(seededRandom(hash) * 2);
		
		for (let g = 0; g < blockGroups; g++) {
			const groupX = seededRandom(hash + g * 100) * 60 + 10;
			const groupY = seededRandom(hash + g * 100 + 50) * 40 + 20;
			const groupCols = 3 + Math.floor(seededRandom(hash + g * 100 + 60) * 3);
			const groupRows = 3 + Math.floor(seededRandom(hash + g * 100 + 70) * 4);
			
			for (let row = 0; row < groupRows; row++) {
				for (let col = 0; col < groupCols; col++) {
					const show = seededRandom(hash + g * 1000 + row * 10 + col) > 0.35;
					if (show) {
						const x = groupX + col * 6;
						const y = groupY + row * 5;
						const w = 4 + seededRandom(hash + g * 1000 + row * 10 + col + 500) * 2;
						const h = 3;
						items.push(
							<rect
								key={`block-${g}-${row}-${col}`}
								x={x}
								y={y}
								width={w}
								height={h}
								fill="currentColor"
								opacity={0.7 + seededRandom(hash + g * 1000 + row * 10 + col + 600) * 0.3}
							/>
						);
					}
				}
			}
		}
		
		for (let i = 0; i < 15; i++) {
			const x = seededRandom(hash + i + 2000) * 90 + 5;
			const y = seededRandom(hash + i + 2100) * 90 + 5;
			const size = (seededRandom(hash + i + 2200) * 2 + 0.5) * 2;
			items.push(
				<rect
					key={`dot-${i}`}
					x={x - size / 2}
					y={y - size / 2}
					width={size}
					height={size}
					fill="currentColor"
					opacity="0.4"
				/>
			);
		}
		
		return items;
	}, [hash]);

	return (
		<svg className="post-thumbnail-v2-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
			{blocks}
		</svg>
	);
}

function WaveformDisplay({ hash }: { hash: number }) {
	const elements = useMemo(() => {
		const items: JSX.Element[] = [];
		const numWaves = 4 + Math.floor(seededRandom(hash) * 3);
		
		for (let w = 0; w < numWaves; w++) {
			const baseY = 15 + w * (70 / numWaves);
			const amplitude = 5 + seededRandom(hash + w * 100) * 10;
			const frequency = 2 + seededRandom(hash + w * 100 + 50) * 4;
			const phase = seededRandom(hash + w * 100 + 60) * Math.PI * 2;
			
			const points: string[] = [];
			for (let x = 0; x <= 100; x += 2) {
				const y = baseY + Math.sin((x / 100) * Math.PI * frequency + phase) * amplitude;
				points.push(`${x},${y}`);
			}
			
			items.push(
				<polyline
					key={`wave-${w}`}
					points={points.join(" ")}
					fill="none"
					stroke="currentColor"
					strokeWidth={1 + seededRandom(hash + w * 100 + 70)}
					opacity={0.4 + seededRandom(hash + w * 100 + 80) * 0.4}
					style={{ animationDelay: `${w * 0.3}s` }}
				/>
			);
		}
		
		const numBars = 20 + Math.floor(seededRandom(hash + 500) * 15);
		for (let i = 0; i < numBars; i++) {
			const x = (i / numBars) * 100;
			const height = seededRandom(hash + i + 600) * 30 + 5;
			const y = 85 - height;
			items.push(
				<rect
					key={`bar-${i}`}
					x={x}
					y={y}
					width={100 / numBars - 1}
					height={height}
					fill="currentColor"
					opacity={0.3 + seededRandom(hash + i + 700) * 0.4}
					style={{ animationDelay: `${(i % 10) * 0.1}s` }}
				/>
			);
		}
		
		return items;
	}, [hash]);

	return (
		<svg className="post-thumbnail-v2-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
			{elements}
		</svg>
	);
}

function AbstractFigure({ hash }: { hash: number }) {
	const elements = useMemo(() => {
		const items: JSX.Element[] = [];

		const centerX = 50 + (seededRandom(hash) - 0.5) * 20;
		const centerY = 45 + (seededRandom(hash + 1) - 0.5) * 10;

		// Concentric squares instead of circles
		const numRings = 6 + Math.floor(seededRandom(hash + 2) * 4);
		for (let i = 0; i < numRings; i++) {
			const size = (8 + i * 5) * 2;
			const dashArray = seededRandom(hash + i + 100) > 0.5
				? `${5 + seededRandom(hash + i + 110) * 10} ${3 + seededRandom(hash + i + 120) * 5}`
				: "none";
			items.push(
				<rect
					key={`ring-${i}`}
					x={centerX - size / 2}
					y={centerY - size / 2}
					width={size}
					height={size}
					fill="none"
					stroke="currentColor"
					strokeWidth={seededRandom(hash + i + 130) > 0.7 ? 2 : 1}
					strokeDasharray={dashArray}
					opacity={0.2 + (1 - i / numRings) * 0.5}
					style={{ animationDelay: `${i * 0.2}s` }}
				/>
			);
		}

		const numRays = 8 + Math.floor(seededRandom(hash + 200) * 8);
		for (let i = 0; i < numRays; i++) {
			const angle = (i / numRays) * Math.PI * 2 + seededRandom(hash + 210) * 0.5;
			const length = 20 + seededRandom(hash + i + 220) * 25;
			const x2 = centerX + Math.cos(angle) * length;
			const y2 = centerY + Math.sin(angle) * length;
			items.push(
				<line
					key={`ray-${i}`}
					x1={centerX}
					y1={centerY}
					x2={x2}
					y2={y2}
					stroke="currentColor"
					strokeWidth="1"
					opacity={0.3 + seededRandom(hash + i + 230) * 0.3}
				/>
			);
		}

		// Core square
		const coreSize = (5 + seededRandom(hash + 300) * 3) * 2;
		items.push(
			<rect
				key="core"
				x={centerX - coreSize / 2}
				y={centerY - coreSize / 2}
				width={coreSize}
				height={coreSize}
				fill="currentColor"
				opacity="0.9"
			/>
		);

		// Scattered squares
		const numDots = 30 + Math.floor(seededRandom(hash + 400) * 20);
		for (let i = 0; i < numDots; i++) {
			const angle = seededRandom(hash + i + 500) * Math.PI * 2;
			const dist = 15 + seededRandom(hash + i + 510) * 35;
			const x = centerX + Math.cos(angle) * dist;
			const y = centerY + Math.sin(angle) * dist;
			const size = (seededRandom(hash + i + 520) * 2 + 0.5) * 2;
			items.push(
				<rect
					key={`scatter-${i}`}
					x={x - size / 2}
					y={y - size / 2}
					width={size}
					height={size}
					fill="currentColor"
					opacity={0.3 + seededRandom(hash + i + 530) * 0.5}
					style={{ animationDelay: `${(i % 15) * 0.12}s` }}
				/>
			);
		}

		return items;
	}, [hash]);

	return (
		<svg className="post-thumbnail-v2-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
			{elements}
		</svg>
	);
}
