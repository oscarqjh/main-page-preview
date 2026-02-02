"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

type MorphState = "landscape" | "waveform" | "matrix";

const GRID_SIZE = 32; // 32x32 = 1024 particles
const PARTICLE_COUNT = GRID_SIZE * GRID_SIZE;
const MORPH_DURATION = 1600; // Faster transition
const HOLD_DURATION = 3000;

interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
}

export function ParticleMorphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentState, setCurrentState] = useState<MorphState>("landscape");
  
  // Store target positions for each state
  const positionsMap = useMemo(() => {
    const map: Record<MorphState, Point3D[]> = {
      landscape: [],
      waveform: [],
      matrix: []
    };

    // 1. Loss Landscape (2.5D Isometric)
    const centerX = 200;
    const centerY = 200;
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const u = (i / (GRID_SIZE - 1)) * 2 - 1; 
        const v = (j / (GRID_SIZE - 1)) * 2 - 1; 
        
        const z = 
          0.8 * Math.exp(-(u**2 + v**2) / 0.4) +
          0.3 * Math.sin(u * 5 + v * 5) * Math.cos(u * 3 - v * 3) +
          0.1 * Math.sin(u * 15);
        
        const spacing = 8;
        const isoX = (i - j) * spacing * 0.8;
        const isoY = (i + j) * spacing * 0.45 - z * 50;
        
        map.landscape.push({
          x: centerX + isoX,
          y: centerY + isoY - 20,
          z: z
        });
      }
    }

    // 2. Waveform (Grunge Sound Wave Pattern)
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const u = i / (GRID_SIZE - 1);
        const v = j / (GRID_SIZE - 1);
        
        const width = 380;
        const x = centerX - width/2 + u * width;
        
        // Noisy waveform function
        const xNorm = (u - 0.5) * 8;
        
        // Main signal carrier
        let signal = Math.sin(xNorm * 3) * Math.cos(xNorm * 15);
        // Add harmonic noise
        signal += Math.sin(xNorm * 43) * 0.3;
        signal += (Math.random() - 0.5) * 0.2; 
        
        // Sharp decay envelope
        const envelope = Math.exp(-Math.abs(xNorm) * 0.8);
        
        const maxAmp = 100 * envelope * Math.abs(signal);
        
        const vNorm = (v - 0.5) * 2; 
        const yOffset = vNorm * maxAmp;
        const y = centerY + yOffset;
        
        let z = 1 - Math.abs(vNorm); 
        if (Math.random() > 0.8) z *= 0.5; 
        
        map.waveform.push({
          x: x,
          y: y,
          z: z
        });
      }
    }

    // 3. Matrix (Perfect Flat Grid)
    const matrixSpacing = 10;
    const matrixW = (GRID_SIZE - 1) * matrixSpacing;
    const matrixH = (GRID_SIZE - 1) * matrixSpacing;
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = centerX - matrixW/2 + j * matrixSpacing;
        const y = centerY - matrixH/2 + i * matrixSpacing;
        
        map.matrix.push({
          x: x,
          y: y,
          z: 0
        });
      }
    }

    return map;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 400 * dpr;
    canvas.height = 400 * dpr;
    ctx.scale(dpr, dpr);

    let startTime = 0;
    let lastStateTime = 0;
    let animationFrameId: number;
    let stateIdx = 0;
    const states: MorphState[] = ["landscape", "waveform", "matrix"];

    const currentParticles = new Float32Array(PARTICLE_COUNT * 3); 
    positionsMap[states[0]].forEach((p, i) => {
      currentParticles[i*3] = p.x;
      currentParticles[i*3+1] = p.y;
      currentParticles[i*3+2] = p.z;
    });

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      if (!lastStateTime) lastStateTime = timestamp;

      const totalElapsed = timestamp - lastStateTime;
      
      let progress = 0;
      let isHolding = false;

      if (totalElapsed < MORPH_DURATION) {
        progress = easeInOutCubic(totalElapsed / MORPH_DURATION);
      } else if (totalElapsed < MORPH_DURATION + HOLD_DURATION) {
        progress = 1;
        isHolding = true;
      } else {
        stateIdx = (stateIdx + 1) % states.length;
        setCurrentState(states[stateIdx]);
        lastStateTime = timestamp;
        progress = 0;
      }

      const targetState = states[stateIdx];
      const prevState = states[(stateIdx - 1 + states.length) % states.length];
      
      const sourcePos = positionsMap[prevState];
      const targetPos = positionsMap[targetState];

      ctx.clearRect(0, 0, 400, 400);
      
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#fed7aa';
      ctx.fillStyle = themeColor;

      // Unified Tempo Base
      const tempo = timestamp * 0.002;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const sx = sourcePos[i].x;
        const sy = sourcePos[i].y;
        const sz = sourcePos[i].z;

        const tx = targetPos[i].x;
        const ty = targetPos[i].y;
        const tz = targetPos[i].z;

        const x = lerp(sx, tx, progress);
        const baseTargetY = lerp(sy, ty, progress); 
        const z = lerp(sz, tz, progress);

        // Apply idle animations
        let drawY = baseTargetY;
        let drawSize = 1.2 + z * 1.5;
        let opacity = 0.3 + z * 0.7;

        if (isHolding) {
          if (targetState === 'waveform') {
               // Waveform: Voice Activity Simulation
               // Simulating natural speech amplitude patterns
               
               // 1. "Speech" Envelope (Amplitude Modulation)
               // Combines slow breathing with faster syllabic rhythms
               const speechEnvelope = Math.abs(Math.sin(tempo * 3)) * Math.abs(Math.cos(tempo * 7.5)) * 1.2;
               
               // 2. Spectral variance
               // Columns react slightly differently
               const colIdx = Math.floor(i / GRID_SIZE);
               const spectrum = Math.sin(colIdx * 0.3 + tempo * 2) * 0.2 + 1;
               
               const centerY = 200;
               const distY = drawY - centerY;
               
               // Apply elastic scaling based on speech volume
               // Base scale (0.6) + dynamic speech
               drawY = centerY + distY * (0.6 + speechEnvelope * spectrum);
               
               // 3. Internal Flow (Smooth, not jittery)
               drawY += Math.sin(tempo * 8 + i * 0.1) * 2;

          } else if (targetState === 'matrix') {
               // Matrix: Data Flow
               // Faster than before (0.002 -> tempo approx 0.002 but with higher freq waves)
               
               // Physical ripple
               drawY += Math.sin(x * 0.03 + tempo * 1.5) * 3;
               
               // Interference pattern
               const wave1 = Math.sin(x * 0.02 + tempo * 2.0); 
               const wave2 = Math.cos(baseTargetY * 0.02 + tempo * 2.5);
               const activation = (wave1 + wave2) / 2;
               const intensity = Math.pow((activation + 1) / 2, 5); 
               
               opacity = 0.15 + intensity * 0.85; 
               drawSize = 1.5 + intensity * 3.0;

          } else if (targetState === 'landscape') {
               // Landscape: Gentle Breathing
               // New animation for consistency
               const breathe = Math.sin(tempo + x * 0.01 + baseTargetY * 0.01);
               drawY += breathe * 2;
               opacity += breathe * 0.1;
          }
        } else {
           // Transition: Organic Morph
           // Add slight noise to movement so it's not robotic linear interpolation
           const morphNoise = Math.sin(tempo * 5 + i) * (1 - Math.abs(progress - 0.5) * 2) * 2;
           drawY += morphNoise;
        }

        ctx.globalAlpha = Math.max(0.1, Math.min(1, opacity));
        ctx.beginPath();
        ctx.arc(x, drawY, drawSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [positionsMap]);

  return (
    <div className="particle-morph-container">
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: 'auto', maxWidth: '400px' }}
      />
      <div className="particle-morph-label">
        <span className="label-text">{currentState}</span>
      </div>
    </div>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
