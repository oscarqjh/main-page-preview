"use client";

import React, { useMemo } from "react";

interface Point {
  x: number;
  y: number;
  z: number;
  delay: number;
}

export function LossLandscape() {
  const points = useMemo(() => {
    const pts: Point[] = [];
    const gridSize = 18;
    const spacing = 14;
    
    const centerX = 200;
    const centerY = 200;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const nx = (i / (gridSize - 1)) * 2 - 1;
        const ny = (j / (gridSize - 1)) * 2 - 1;
        
        const z = 
          0.7 * Math.exp(-(nx ** 2 + ny ** 2) / 0.3) +
          0.4 * Math.exp(-((nx - 0.5) ** 2 + (ny + 0.3) ** 2) / 0.2) +
          0.3 * Math.exp(-((nx + 0.5) ** 2 + (ny - 0.3) ** 2) / 0.2) +
          0.1 * Math.sin(nx * 3) * Math.cos(ny * 3);
        
        const isoX = (i - j) * spacing * 0.6;
        const isoY = (i + j) * spacing * 0.35 - z * 60;
        
        pts.push({
          x: isoX + centerX,
          y: isoY + centerY - (gridSize * spacing * 0.35),
          z: z,
          delay: (i + j) * 0.04,
        });
      }
    }
    return pts;
  }, []);

  const baseOpacity = 0.3;
  const maxOpacity = 1;

  return (
    <div className="loss-landscape-container">
      <svg
        className="loss-landscape-svg"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {points
          .sort((a, b) => a.y - b.y)
          .map((point, idx) => {
            const size = 2 + point.z * 4;
            const opacity = baseOpacity + point.z * (maxOpacity - baseOpacity);
            
            return (
              <circle
                key={idx}
                cx={point.x}
                cy={point.y}
                r={size}
                fill="var(--foreground)"
                opacity={opacity}
                className="landscape-particle"
                style={{
                  animationDelay: `${point.delay}s`,
                }}
              />
            );
          })}

        <circle
          cx={200}
          cy={200}
          r="8"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="1.5"
          className="optimal-marker"
        />
      </svg>
      
      <div className="loss-landscape-label">
        <span className="label-text">Loss Landscape</span>
      </div>
    </div>
  );
}
