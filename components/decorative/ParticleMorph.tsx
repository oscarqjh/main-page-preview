"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface ParticleState {
  x: number;
  y: number;
  size: number;
}

type MorphState = "landscape" | "waveform" | "matrix";

const GRID_SIZE = 16;
const PARTICLE_COUNT = GRID_SIZE * GRID_SIZE;
const MORPH_DURATION = 2000;
const HOLD_DURATION = 3000;

export function ParticleMorph() {
  const [currentState, setCurrentState] = useState<MorphState>("landscape");
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const isHoldingRef = useRef(true);

  const states: MorphState[] = ["landscape", "waveform", "matrix"];

  const generatePositions = useMemo(() => {
    const positions: Record<MorphState, ParticleState[]> = {
      landscape: [],
      waveform: [],
      matrix: [],
    };

    const centerX = 200;
    const centerY = 200;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const idx = i * GRID_SIZE + j;
        const nx = (i / (GRID_SIZE - 1)) * 2 - 1;
        const ny = (j / (GRID_SIZE - 1)) * 2 - 1;

        const z =
          0.7 * Math.exp(-(nx ** 2 + ny ** 2) / 0.3) +
          0.35 * Math.exp(-((nx - 0.5) ** 2 + (ny + 0.4) ** 2) / 0.2) +
          0.35 * Math.exp(-((nx + 0.5) ** 2 + (ny - 0.4) ** 2) / 0.2);

        const spacing = 14;
        const isoX = (i - j) * spacing * 0.6;
        const isoY = (i + j) * spacing * 0.35 - z * 55;

        positions.landscape.push({
          x: isoX + centerX,
          y: isoY + centerY - GRID_SIZE * spacing * 0.35 + 40,
          size: 2.5 + z * 4,
        });

        const waveX = 40 + (idx / PARTICLE_COUNT) * 320;
        const wavePhase = (idx / PARTICLE_COUNT) * Math.PI * 4;
        const waveY = centerY + Math.sin(wavePhase) * 60;
        const waveSize = 3 + Math.abs(Math.sin(wavePhase)) * 3;

        positions.waveform.push({
          x: waveX,
          y: waveY,
          size: waveSize,
        });

        const matrixSpacing = 22;
        const matrixOffsetX = centerX - ((GRID_SIZE - 1) * matrixSpacing) / 2;
        const matrixOffsetY = centerY - ((GRID_SIZE - 1) * matrixSpacing) / 2;

        positions.matrix.push({
          x: matrixOffsetX + j * matrixSpacing,
          y: matrixOffsetY + i * matrixSpacing,
          size: 4,
        });
      }
    }

    return positions;
  }, []);

  useEffect(() => {
    let currentStateIndex = 0;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (isHoldingRef.current) {
        if (elapsed >= HOLD_DURATION) {
          isHoldingRef.current = false;
          startTimeRef.current = timestamp;
        }
        setProgress(0);
      } else {
        const morphProgress = Math.min(elapsed / MORPH_DURATION, 1);
        const easedProgress = easeInOutCubic(morphProgress);
        setProgress(easedProgress);

        if (morphProgress >= 1) {
          currentStateIndex = (currentStateIndex + 1) % states.length;
          setCurrentState(states[currentStateIndex]);
          isHoldingRef.current = true;
          startTimeRef.current = timestamp;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [states]);

  const getNextState = (current: MorphState): MorphState => {
    const idx = states.indexOf(current);
    return states[(idx + 1) % states.length];
  };

  const currentPositions = generatePositions[currentState];
  const nextPositions = generatePositions[getNextState(currentState)];

  return (
    <div className="particle-morph-container">
      <svg
        className="particle-morph-svg"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {currentPositions.map((current, idx) => {
          const next = nextPositions[idx];
          const x = lerp(current.x, next.x, progress);
          const y = lerp(current.y, next.y, progress);
          const size = lerp(current.size, next.size, progress);

          const jumpOffset =
            currentState === "matrix" || getNextState(currentState) === "matrix"
              ? Math.sin(Date.now() * 0.003 + idx * 0.5) * 2 * (1 - Math.abs(progress - 0.5) * 2)
              : 0;

          return (
            <circle
              key={idx}
              cx={x}
              cy={y + jumpOffset}
              r={size}
              fill="var(--foreground)"
              className="morph-particle"
            />
          );
        })}
      </svg>

      <div className="particle-morph-label">
        <span className="label-text">{currentState}</span>
      </div>
    </div>
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
