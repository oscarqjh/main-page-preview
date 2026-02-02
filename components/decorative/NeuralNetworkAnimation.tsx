"use client";

import { useEffect, useMemo, useState } from "react";

export function NeuralNetworkAnimation() {
  // Use a deterministic set of nodes to avoid hydration mismatch
  // but animate them with CSS
  
  // Grid-like structure with some randomness, but fixed for consistency
  const nodes = useMemo(() => {
    const points = [
      { x: 20, y: 50, r: 4 },
      { x: 35, y: 30, r: 3 },
      { x: 35, y: 70, r: 5 },
      { x: 50, y: 50, r: 6 }, // center hub
      { x: 50, y: 20, r: 3 },
      { x: 50, y: 80, r: 3 },
      { x: 65, y: 30, r: 5 },
      { x: 65, y: 70, r: 4 },
      { x: 80, y: 50, r: 3 },
      // Satellites
      { x: 25, y: 25, r: 2 },
      { x: 25, y: 75, r: 2 },
      { x: 75, y: 25, r: 2 },
      { x: 75, y: 75, r: 2 },
    ];
    return points;
  }, []);

  const links = useMemo(() => {
    // Connect nearby nodes
    return [
      [0, 1], [0, 2], [0, 3],
      [1, 3], [1, 4], [2, 3], [2, 5],
      [3, 4], [3, 5], [3, 6], [3, 7],
      [4, 6], [5, 7],
      [6, 8], [7, 8],
      // Satellite connections
      [9, 1], [10, 2], [11, 6], [12, 7]
    ];
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="neural-network-container">
      <svg
        viewBox="0 0 100 100"
        className="neural-network-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Links */}
        <g className="neural-links">
          {links.map(([startIndex, endIndex], i) => {
            const start = nodes[startIndex];
            const end = nodes[endIndex];
            return (
              <line
                key={`link-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                className="neural-link"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="neural-nodes">
          {nodes.map((node, i) => (
            <circle
              key={`node-${i}`}
              cx={node.x}
              cy={node.y}
              r={node.r}
              className="neural-node"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </g>
        
        {/* Data Packets (animated dots moving along paths) */}
        {mounted && (
            <g className="neural-packets">
                <circle r="1.5" className="neural-packet packet-1">
                    <animateMotion 
                        dur="3s" 
                        repeatCount="indefinite"
                        path={`M${nodes[0].x},${nodes[0].y} L${nodes[3].x},${nodes[3].y} L${nodes[6].x},${nodes[6].y} L${nodes[8].x},${nodes[8].y}`}
                    />
                </circle>
                <circle r="1.5" className="neural-packet packet-2">
                    <animateMotion 
                        dur="4s" 
                        repeatCount="indefinite"
                        begin="1s"
                        path={`M${nodes[4].x},${nodes[4].y} L${nodes[3].x},${nodes[3].y} L${nodes[7].x},${nodes[7].y}`}
                    />
                </circle>
                <circle r="1.5" className="neural-packet packet-3">
                    <animateMotion 
                        dur="5s" 
                        repeatCount="indefinite"
                        begin="0.5s"
                        path={`M${nodes[2].x},${nodes[2].y} L${nodes[5].x},${nodes[5].y} L${nodes[7].x},${nodes[7].y} L${nodes[8].x},${nodes[8].y}`}
                    />
                </circle>
            </g>
        )}
      </svg>
    </div>
  );
}
