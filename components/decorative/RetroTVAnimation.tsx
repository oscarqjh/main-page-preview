"use client";

import React, { useEffect, useState } from "react";

/**
 * RetroTVAnimation - Braun/Dieter Rams Style
 * 
 * Minimalist monitor design with 4 rotating animated scenes
 * representing Multimodal AI concepts:
 * 1. Audio/Signal Processing
 * 2. Computer Vision (Patchification)
 * 3. Robotics/Control
 * 4. Human-AI Collaboration (Creation of Adam)
 */
export function RetroTVAnimation() {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const sceneDuration = 6000; // 6 seconds per scene
    
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % 4);
    }, sceneDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="braun-tv-container">
      {/* Outer Housing - Clean geometric shell */}
      <div className="braun-tv-housing">
        
        {/* Screen Area */}
        <div className="braun-tv-screen-area">
          {/* Screen Bezel */}
          <div className="braun-tv-bezel">
            {/* Display Screen */}
            <div className="braun-tv-screen">
              <svg
                className="braun-tv-display"
                viewBox="0 0 200 150"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Scene 1: Audio Waveform to Digital */}
                <g 
                  className={`tv-scene ${activeScene === 0 ? "active" : ""}`}
                  style={{ opacity: activeScene === 0 ? 1 : 0 }}
                >
                  {/* Analog Wave */}
                  <path
                    d="M 15 75 Q 30 40, 45 75 T 75 75"
                    className="scene1-wave"
                    stroke="var(--foreground)"
                    strokeWidth="2"
                    fill="none"
                  />
                  
                  {/* Arrow */}
                  <line x1="85" y1="75" x2="115" y2="75" stroke="var(--foreground)" strokeWidth="1.5" opacity="0.6" />
                  <polygon points="115,75 108,71 108,79" fill="var(--foreground)" opacity="0.6" />

                  {/* Digital Grid */}
                  <g transform="translate(125, 55)">
                    {[...Array(16)].map((_, i) => (
                      <rect
                        key={`bit-${i}`}
                        x={(i % 4) * 14}
                        y={Math.floor(i / 4) * 14}
                        width="10"
                        height="10"
                        className={`bit-pixel bit-${i}`}
                        fill="var(--foreground)"
                      />
                    ))}
                  </g>
                </g>

                {/* Scene 2: Vision Patchification */}
                <g 
                  className={`tv-scene ${activeScene === 1 ? "active" : ""}`}
                  style={{ opacity: activeScene === 1 ? 1 : 0 }}
                >
                  {/* Portrait Frame */}
                  <g transform="translate(25, 35)">
                    <rect x="0" y="0" width="55" height="80" fill="none" stroke="var(--foreground)" strokeWidth="1.5" />
                    {/* Minimal Face */}
                    <circle cx="18" cy="28" r="3" fill="var(--foreground)" />
                    <circle cx="37" cy="28" r="3" fill="var(--foreground)" />
                    <line x1="27" y1="38" x2="27" y2="50" stroke="var(--foreground)" strokeWidth="1.5" />
                    <path d="M 18 60 Q 27 68, 37 60" stroke="var(--foreground)" strokeWidth="1.5" fill="none" />
                    {/* Grid overlay */}
                    <line x1="0" y1="26" x2="55" y2="26" stroke="var(--foreground)" strokeWidth="0.5" opacity="0.3" />
                    <line x1="0" y1="53" x2="55" y2="53" stroke="var(--foreground)" strokeWidth="0.5" opacity="0.3" />
                    <line x1="18" y1="0" x2="18" y2="80" stroke="var(--foreground)" strokeWidth="0.5" opacity="0.3" />
                    <line x1="37" y1="0" x2="37" y2="80" stroke="var(--foreground)" strokeWidth="0.5" opacity="0.3" />
                  </g>

                  {/* Arrow */}
                  <line x1="90" y1="75" x2="115" y2="75" stroke="var(--foreground)" strokeWidth="1.5" opacity="0.6" />
                  <polygon points="115,75 108,71 108,79" fill="var(--foreground)" opacity="0.6" />

                  {/* Extracted Patches */}
                  <g transform="translate(125, 40)">
                    <rect x="0" y="0" width="16" height="16" fill="var(--foreground)" opacity="0.3" className="patch-1" />
                    <rect x="20" y="10" width="16" height="16" fill="var(--foreground)" opacity="0.5" className="patch-2" />
                    <rect x="40" y="0" width="16" height="16" fill="var(--foreground)" opacity="0.7" className="patch-3" />
                    <rect x="10" y="30" width="16" height="16" fill="var(--foreground)" opacity="0.9" className="patch-4" />
                    <rect x="30" y="40" width="16" height="16" fill="var(--foreground)" className="patch-5" />
                  </g>
                </g>

                {/* Scene 3: Robot Arm */}
                <g 
                  className={`tv-scene ${activeScene === 2 ? "active" : ""}`}
                  style={{ opacity: activeScene === 2 ? 1 : 0 }}
                >
                  <g transform="translate(30, 55)" className="scene3-arm">
                    {/* Base */}
                    <rect x="0" y="10" width="24" height="30" fill="var(--foreground)" />
                    
                    {/* Arm segment 1 */}
                    <rect x="24" y="18" width="50" height="14" fill="var(--foreground)" />
                    
                    {/* Joint */}
                    <circle cx="74" cy="25" r="8" fill="var(--foreground)" />
                    
                    {/* Arm segment 2 */}
                    <g transform="translate(74, 25) rotate(-25)">
                      <rect x="0" y="-6" width="40" height="12" fill="var(--foreground)" />
                      
                      {/* Gripper */}
                      <g transform="translate(40, 0)">
                        <line x1="0" y1="0" x2="20" y2="-8" stroke="var(--foreground)" strokeWidth="5" className="finger-top" />
                        <line x1="0" y1="0" x2="20" y2="8" stroke="var(--foreground)" strokeWidth="5" className="finger-bottom" />
                      </g>
                    </g>
                    
                    {/* Target */}
                    <rect x="125" y="-15" width="18" height="18" fill="none" stroke="var(--foreground)" strokeWidth="2" className="target-obj">
                      <animateTransform attributeName="transform" type="rotate" from="0 134 -6" to="360 134 -6" dur="8s" repeatCount="indefinite" />
                    </rect>
                  </g>
                </g>

                {/* Scene 4: Creation of AI */}
                <g 
                  className={`tv-scene ${activeScene === 3 ? "active" : ""}`}
                  style={{ opacity: activeScene === 3 ? 1 : 0 }}
                >
                  {/* Robot Hand (Left) */}
                  <g transform="translate(15, 75)" className="scene4-robot">
                    {/* Forearm */}
                    <rect x="0" y="-8" width="50" height="16" fill="var(--foreground)" />
                    {/* Joint lines */}
                    <line x1="15" y1="-8" x2="15" y2="8" stroke="var(--background)" strokeWidth="2" />
                    <line x1="30" y1="-8" x2="30" y2="8" stroke="var(--background)" strokeWidth="2" />
                    {/* Wrist */}
                    <circle cx="50" cy="0" r="8" fill="var(--foreground)" />
                    {/* Finger */}
                    <line x1="55" y1="0" x2="80" y2="0" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" />
                  </g>

                  {/* Human Hand (Right) */}
                  <g transform="translate(185, 75) scale(-1, 1)" className="scene4-human">
                    <path d="M 0 0 C 20 -5, 40 5, 60 0" stroke="var(--foreground)" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <path d="M 60 0 L 80 3" stroke="var(--foreground)" strokeWidth="5" strokeLinecap="round" />
                  </g>

                  {/* Spark */}
                  <g className="creation-spark">
                    <circle cx="100" cy="75" r="2" fill="var(--foreground)">
                      <animate attributeName="r" values="2;6;2" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    {/* Rays */}
                    <line x1="100" y1="65" x2="100" y2="58" stroke="var(--foreground)" strokeWidth="1" className="spark-ray" />
                    <line x1="100" y1="85" x2="100" y2="92" stroke="var(--foreground)" strokeWidth="1" className="spark-ray" />
                    <line x1="90" y1="75" x2="83" y2="75" stroke="var(--foreground)" strokeWidth="1" className="spark-ray" />
                    <line x1="110" y1="75" x2="117" y2="75" stroke="var(--foreground)" strokeWidth="1" className="spark-ray" />
                  </g>
                </g>

              </svg>
              
              {/* Subtle screen effects */}
              <div className="braun-screen-vignette"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar - Minimal controls */}
        <div className="braun-tv-controls">
          <div className="braun-tv-brand">LMMS</div>
          <div className="braun-tv-indicator">
            <div className="indicator-dot"></div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
