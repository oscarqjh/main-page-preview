"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type MorphState = "loss" | "waveform" | "lena" | "matrix";

const GRID_SIZE = 32; // 32x32 = 1024 particles
const PARTICLE_COUNT = GRID_SIZE * GRID_SIZE;
const MORPH_DURATION = 3.0;
const HOLD_DURATION = 5.0;

// Hardcoded 32x32 Lena (Simplified manually)
// 0 = Dark, 9 = Bright
const LENA_DATA = [
  // Hat / Top Background
  3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
  3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,
  3,3,3,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,3,3,
  3,3,4,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,4,3,3,
  3,4,5,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,5,4,3,3,
  // Forehead / Eyes
  4,5,6,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,7,6,5,4,3,3,
  4,5,7,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,8,7,6,5,4,3,3,
  4,5,7,8,9,9,9,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,8,7,6,5,4,3,3,
  4,5,7,8,9,9,8,6,5,5,5,6,6,6,6,6,6,6,5,5,5,6,8,9,9,8,7,6,5,4,3,3,
  4,5,7,8,9,8,6,4,3,3,3,4,4,4,4,4,4,4,3,3,3,4,6,8,9,8,7,6,5,4,3,3,
  4,5,6,8,9,7,5,3,2,2,2,3,3,3,3,3,3,3,2,2,2,3,5,7,9,8,6,5,4,3,3,3,
  // Nose / Cheeks
  4,5,6,7,8,6,4,3,2,2,2,3,3,3,3,3,3,3,2,2,2,3,4,6,8,7,6,5,4,3,3,3,
  3,4,5,6,7,5,3,2,2,2,2,3,4,4,4,4,4,3,2,2,2,2,3,5,7,6,5,4,3,3,3,3,
  3,4,5,6,7,5,3,2,2,2,2,3,5,6,6,6,5,3,2,2,2,2,3,5,7,6,5,4,3,3,3,3,
  3,4,5,6,7,5,3,2,2,2,3,4,6,7,7,7,6,4,3,2,2,2,3,5,7,6,5,4,3,3,3,3,
  3,4,5,6,7,5,3,2,2,3,4,5,7,8,8,8,7,5,4,3,2,2,3,5,7,6,5,4,3,3,3,3,
  // Mouth / Chin
  3,4,5,6,7,5,3,3,3,4,5,6,7,8,8,8,7,6,5,4,3,3,3,5,7,6,5,4,3,3,3,3,
  3,4,5,6,7,6,4,3,4,5,6,7,7,7,7,7,7,7,6,5,4,3,4,6,7,6,5,4,3,3,3,3,
  3,4,5,6,7,6,5,4,5,6,7,8,8,8,8,8,8,8,7,6,5,4,5,6,7,6,5,4,3,3,3,3,
  3,3,4,5,6,7,6,5,6,7,8,9,9,9,9,9,9,9,8,7,6,5,6,7,6,5,4,3,3,3,3,3,
  3,3,4,5,6,7,7,6,7,8,9,9,9,9,9,9,9,9,9,8,7,6,7,7,6,5,4,3,3,3,3,3,
  3,3,3,4,5,6,7,7,8,9,9,9,8,8,8,8,8,9,9,9,8,7,7,6,5,4,3,3,3,3,3,3,
  3,3,3,4,5,5,6,7,8,9,9,8,7,7,7,7,7,8,9,9,8,7,6,5,5,4,3,3,3,3,3,3,
  3,3,3,3,4,5,6,7,8,9,8,7,6,6,6,6,6,7,8,9,8,7,6,5,4,3,3,3,3,3,3,3,
  // Shoulders
  3,3,3,3,4,4,5,6,7,8,7,6,5,5,5,5,5,6,7,8,7,6,5,4,4,3,3,3,3,3,3,3,
  3,3,3,3,3,4,5,6,7,7,6,5,4,4,4,4,4,5,6,7,7,6,5,4,3,3,3,3,3,3,3,3,
  3,3,3,3,3,3,4,5,6,6,5,4,3,3,3,3,3,4,5,6,6,5,4,3,3,3,3,3,3,3,3,3,
  2,2,2,2,2,3,4,5,5,5,4,3,2,2,2,2,2,3,4,5,5,5,4,3,2,2,2,2,2,2,2,2,
  2,2,2,2,2,2,3,4,4,4,3,2,2,2,2,2,2,2,3,4,4,4,3,2,2,2,2,2,2,2,2,2,
  2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,
  2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
  2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2
];

interface ParticleMorphThreeProps {
  onStateChange?: (state: string) => void;
}

export function ParticleMorphThree({ onStateChange }: ParticleMorphThreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentState, setCurrentState] = useState<MorphState>("loss");

  useEffect(() => {
    // Initial callback
    onStateChange?.("loss");
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera pulled back to Z=300 to fit content with margins
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 300; 
    camera.position.y = 0; 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance" 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0); // Transparent
    containerRef.current.appendChild(renderer.domElement);

    // --- Geometry ---
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const sourcePositions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const targetSizes = new Float32Array(PARTICLE_COUNT);
    const sourceSizes = new Float32Array(PARTICLE_COUNT);

    const BASE_SIZE = 5.0; // Standard dot size for "ON" state

    // Init with ON size
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizes[i] = BASE_SIZE;
      targetSizes[i] = BASE_SIZE;
      sourceSizes[i] = BASE_SIZE;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const sprite = new THREE.TextureLoader().load(
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23ffffff'/%3E%3C/svg%3E"
    );

    const computedStyle = getComputedStyle(document.documentElement);
    const fgColorHex = computedStyle.getPropertyValue('--foreground').trim() || '#fed7aa';
    const particleColor = new THREE.Color(fgColorHex);

    const material = new THREE.PointsMaterial({
      color: particleColor,
      size: 4, 
      map: sprite,
      transparent: true,
      opacity: 0.9,
      alphaTest: 0.1,
      sizeAttenuation: true,
      blending: THREE.NormalBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- State Logic ---
    const states: MorphState[] = ["loss", "waveform", "lena", "matrix"];
    let stateIndex = 0;
    let transitionStartTime = 0;
    let holdStartTime = 0;
    let isHolding = false;

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      const now = performance.now() / 1000;

      // Morph logic
      if (!isHolding) {
        if (transitionStartTime === 0) transitionStartTime = now;
        const progress = Math.min((now - transitionStartTime) / MORPH_DURATION, 1);
        
        const ease = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        if (progress >= 1) {
          isHolding = true;
          holdStartTime = now;
          transitionStartTime = 0;
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            positions[i] = targetPositions[i];
            sourcePositions[i] = targetPositions[i];
          }
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            sizes[i] = targetSizes[i];
            sourceSizes[i] = targetSizes[i];
          }
        } else {
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            positions[i] = sourcePositions[i] + (targetPositions[i] - sourcePositions[i]) * ease;
          }
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            sizes[i] = sourceSizes[i] + (targetSizes[i] - sourceSizes[i]) * ease;
          }
        }
      } else {
        const holdElapsed = now - holdStartTime;
        if (holdElapsed > HOLD_DURATION) {
          isHolding = false;
          stateIndex = (stateIndex + 1) % states.length;
          const nextState = states[stateIndex];
          setCurrentState(nextState);
          onStateChange?.(nextState);
          
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            sourcePositions[i] = positions[i];
          }
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            sourceSizes[i] = sizes[i];
          }
        }
      }

      const targetState = states[stateIndex];
      updateTargets(targetState, time);

      if (isHolding) {
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          positions[i] = targetPositions[i];
        }
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          sizes[i] = targetSizes[i];
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
      
      if (targetState === 'loss') {
         particles.rotation.y = Math.sin(time * 0.1) * 0.15;
         particles.rotation.x = 0.2; 
      } else {
         particles.rotation.y *= 0.95;
         particles.rotation.x *= 0.95;
      }

      renderer.render(scene, camera);
    };

    const updateTargets = (state: MorphState, t: number) => {
      const positions = targetPositions;
      const targetSz = targetSizes;
      const slowT = t * 0.5;

      // Base spacing for the visible grid
      // For 16x16 view, we want spacing to be wider so it fills the same area
      const spacing16 = 14; 
      const offset16 = (16 * spacing16) / 2;

      // For 32x32 view (Lena/Attention), spacing is tighter
      const spacing32 = 7;
      const offset32 = (32 * spacing32) / 2;
      
      // Shift everything up slightly to make room for bottom label
      // Shift down slightly to center visually
      const verticalShift = -15; // Align visual center with left text


      // Helper to map 1024 index -> 256 position (Fold 2x2 -> 1)
      const getFoldedIndices = (idx: number) => {
        const row32 = Math.floor(idx / 32);
        const col32 = idx % 32;
        const row16 = Math.floor(row32 / 2); // 0..15
        const col16 = Math.floor(col32 / 2); // 0..15
        return { row: row16, col: col16, idx16: row16 * 16 + col16 };
      };

      if (state === 'loss') {
        // 3D Loss Surface (Folded to 16x16)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const { row, col } = getFoldedIndices(i);
          const idx3 = i * 3;

          // Map 0..15 to -1..1
          const u = (col / 15) * 2 - 1;
          const v = (row / 15) * 2 - 1;

          const x = (col * spacing16) - offset16;
          const zCoord = (row * spacing16) - offset16;

          const r = Math.sqrt(u*u + v*v);
          const height = 50 * Math.exp(-r*r * 2) 
                       + 15 * Math.cos(u * 4 + slowT) * Math.sin(v * 4);

          positions[idx3] = x;
          positions[idx3+1] = height - 10 + verticalShift;
          positions[idx3+2] = zCoord; 
          
          targetSz[i] = BASE_SIZE;
        }
      } 
      else if (state === 'waveform') {
        // 2D Waveform (Folded to 16x16)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const { row, col } = getFoldedIndices(i);
          const idx3 = i * 3;

          // col is Frequency (X), row is Amplitude (Y)
          const freqBase = col * 0.3;
          const noise = Math.sin(slowT * (2 + col * 0.1) + freqBase);
          const amp = Math.abs(noise) * (1.0 - Math.abs((col/16)-0.5));
          const barHeight = 120 * amp * amp + 20;

          const v = col / 15;
          const vSym = (row / 15 - 0.5) * 2; 

          const x = (col * spacing16) - offset16;
          const y = vSym * barHeight * 0.8 + verticalShift;

          positions[idx3] = x;
          positions[idx3+1] = y;
          positions[idx3+2] = 0; 
          
          targetSz[i] = BASE_SIZE;
        }
      }
      else if (state === 'lena') {
        // 2D Image (Lena) - UNFOLDED to 32x32
        // Use full 1024 resolution
        for (let i = 0; i < GRID_SIZE; i++) { // 0..31
          for (let j = 0; j < GRID_SIZE; j++) { // 0..31
            const idx = i * GRID_SIZE + j;
            const idx3 = idx * 3;
            
            const x = (j * spacing32) - offset32;
            const y = -((i * spacing32) - offset32) + verticalShift; 
            
            positions[idx3] = x;
            positions[idx3+1] = y;
            positions[idx3+2] = 0; 
            
            // Hardcoded Data Logic
            const dataRow = GRID_SIZE - 1 - i;
            const dataIdx = dataRow * GRID_SIZE + j;
            const val = LENA_DATA[dataIdx] || 0;
            
            // Threshold logic
            // Use a mid-range threshold to create contrast
            // Data range is 2-9. Midpoint ~5.5
            // val > 5 means only brightness 6,7,8,9 are shown (Highlights)
            // val > 4 means 5,6,7,8,9 are shown (Face + some hat)
            targetSz[idx] = val > 4 ? BASE_SIZE : 0.0;
          }
        }
      }
      else if (state === 'matrix') {
        // Attention Map (SWA / Sparse) - UNFOLDED to 32x32
        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE; j++) {
            const idx = i * GRID_SIZE + j;
            const pIdx = idx * 3;
            
            const x = (j * spacing32) - offset32;
            const y = -((i * spacing32) - offset32) + verticalShift; 
            
            positions[pIdx] = x;
            positions[pIdx+1] = y;
            positions[pIdx+2] = 0; 
            
            // Attention Pattern Logic (SWA + Global)
            // i = Query, j = Key
            
            // 1. Sliding Window (Diagonal)
            const diff = Math.abs(i - j);
            const isLocal = diff <= 2; 
            
            // 2. Global Tokens (first 2 tokens)
            const isGlobal = j < 2 || i < 2;
            
            // 3. Dynamic Scan
            const scanTime = t * 2; 
            const scanRow = Math.floor(scanTime % GRID_SIZE);
            const isScanning = (i === scanRow) && (Math.abs(j - i) < 8);
            
            let intensity = 0.0;
            if (isLocal) intensity = 1.0;
            else if (isGlobal) intensity = 0.5;
            
            if (isScanning) intensity = 1.0;
            
            // Causal Mask
            if (j > i) intensity = 0.0;
            
            targetSz[idx] = intensity > 0.1 ? BASE_SIZE : 0.0;
          }
        }
      }
    };

    animate();

    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Taller aspect ratio to match text content height better
        // 1:1 or slightly taller/wider depending on layout preference
        const height = width * 0.9; 
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        const targetZ = 300; 
        camera.position.z = targetZ;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []); // Empty dependency array, using refs for mutable data

  return (
    <div className="particle-morph-container">
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      />
      <div className="particle-morph-label">
        <span className="label-text">{currentState}</span>
      </div>
    </div>
  );
}
