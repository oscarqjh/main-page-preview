"use client";

import { useEffect, useState } from "react";

/**
 * Multimodal Sensing Animation
 * Pixel-art style visualization showing different modalities converging
 * - Vision (eye/camera icon)
 * - Audio (waveform)
 * - Text (characters)
 * All flowing towards a central "understanding" core
 */
export function MultimodalAnimation() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pixel grid size
  const pixelSize = 4;
  const gridSize = 24;

  return (
    <div className="multimodal-container" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        className="multimodal-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background pixel grid - subtle */}
        <defs>
          <pattern id="pixelGrid" width={pixelSize} height={pixelSize} patternUnits="userSpaceOnUse">
            <rect width={pixelSize} height={pixelSize} fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#pixelGrid)" />

        {/* Central core - the "understanding" hub */}
        <g className="multimodal-core">
          <rect x="44" y="44" width="12" height="12" className="core-pixel core-main" />
          <rect x="40" y="48" width="4" height="4" className="core-pixel core-orbit" style={{ animationDelay: "0ms" }} />
          <rect x="56" y="48" width="4" height="4" className="core-pixel core-orbit" style={{ animationDelay: "200ms" }} />
          <rect x="48" y="40" width="4" height="4" className="core-pixel core-orbit" style={{ animationDelay: "400ms" }} />
          <rect x="48" y="56" width="4" height="4" className="core-pixel core-orbit" style={{ animationDelay: "600ms" }} />
        </g>

        {/* Vision modality - top left - eye icon made of pixels */}
        <g className="modality vision-modality">
          {/* Eye shape */}
          <rect x="16" y="20" width="4" height="4" className="vision-pixel" style={{ animationDelay: "0ms" }} />
          <rect x="20" y="16" width="4" height="4" className="vision-pixel" style={{ animationDelay: "50ms" }} />
          <rect x="24" y="16" width="4" height="4" className="vision-pixel" style={{ animationDelay: "100ms" }} />
          <rect x="28" y="20" width="4" height="4" className="vision-pixel" style={{ animationDelay: "150ms" }} />
          <rect x="20" y="24" width="4" height="4" className="vision-pixel" style={{ animationDelay: "200ms" }} />
          <rect x="24" y="24" width="4" height="4" className="vision-pixel pupil" style={{ animationDelay: "250ms" }} />
          <rect x="16" y="28" width="4" height="4" className="vision-pixel" style={{ animationDelay: "300ms" }} />
          <rect x="28" y="28" width="4" height="4" className="vision-pixel" style={{ animationDelay: "350ms" }} />
          
          {/* Data stream to center */}
          {mounted && (
            <g className="data-stream vision-stream">
              <rect width="3" height="3" className="data-packet vision-packet">
                <animateMotion dur="2s" repeatCount="indefinite" path="M24,28 Q35,35 44,44" />
              </rect>
              <rect width="2" height="2" className="data-packet vision-packet" style={{ opacity: 0.6 }}>
                <animateMotion dur="2s" repeatCount="indefinite" begin="0.7s" path="M24,28 Q35,35 44,44" />
              </rect>
            </g>
          )}
        </g>

        {/* Audio modality - bottom left - waveform */}
        <g className="modality audio-modality">
          {/* Waveform bars */}
          <rect x="12" y="72" width="3" height="8" className="audio-pixel bar-1" />
          <rect x="16" y="68" width="3" height="16" className="audio-pixel bar-2" />
          <rect x="20" y="70" width="3" height="12" className="audio-pixel bar-3" />
          <rect x="24" y="66" width="3" height="20" className="audio-pixel bar-4" />
          <rect x="28" y="70" width="3" height="12" className="audio-pixel bar-5" />
          <rect x="32" y="68" width="3" height="16" className="audio-pixel bar-6" />
          <rect x="36" y="72" width="3" height="8" className="audio-pixel bar-7" />
          
          {/* Data stream to center */}
          {mounted && (
            <g className="data-stream audio-stream">
              <rect width="3" height="3" className="data-packet audio-packet">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M28,68 Q38,58 44,50" />
              </rect>
              <rect width="2" height="2" className="data-packet audio-packet" style={{ opacity: 0.6 }}>
                <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s" path="M28,68 Q38,58 44,50" />
              </rect>
            </g>
          )}
        </g>

        {/* Text modality - top right - text characters */}
        <g className="modality text-modality">
          {/* Pixelated "Aa" text representation */}
          {/* Letter A */}
          <rect x="68" y="24" width="3" height="3" className="text-pixel" style={{ animationDelay: "0ms" }} />
          <rect x="72" y="24" width="3" height="3" className="text-pixel" style={{ animationDelay: "50ms" }} />
          <rect x="66" y="27" width="3" height="3" className="text-pixel" style={{ animationDelay: "100ms" }} />
          <rect x="75" y="27" width="3" height="3" className="text-pixel" style={{ animationDelay: "150ms" }} />
          <rect x="66" y="30" width="12" height="3" className="text-pixel" style={{ animationDelay: "200ms" }} />
          <rect x="66" y="33" width="3" height="3" className="text-pixel" style={{ animationDelay: "250ms" }} />
          <rect x="75" y="33" width="3" height="3" className="text-pixel" style={{ animationDelay: "300ms" }} />
          
          {/* Cursor blink */}
          <rect x="80" y="24" width="2" height="12" className="text-cursor" />
          
          {/* Data stream to center */}
          {mounted && (
            <g className="data-stream text-stream">
              <rect width="3" height="3" className="data-packet text-packet">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M72,36 Q60,42 56,48" />
              </rect>
              <rect width="2" height="2" className="data-packet text-packet" style={{ opacity: 0.6 }}>
                <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.6s" path="M72,36 Q60,42 56,48" />
              </rect>
            </g>
          )}
        </g>

        {/* Video/Frames modality - bottom right */}
        <g className="modality video-modality">
          {/* Film frame representation */}
          <rect x="68" y="64" width="16" height="12" className="video-pixel frame-border" fill="none" strokeWidth="1" />
          <rect x="70" y="66" width="12" height="8" className="video-pixel frame-inner" />
          {/* Sprocket holes */}
          <rect x="66" y="66" width="2" height="2" className="video-pixel sprocket" />
          <rect x="66" y="72" width="2" height="2" className="video-pixel sprocket" />
          <rect x="84" y="66" width="2" height="2" className="video-pixel sprocket" />
          <rect x="84" y="72" width="2" height="2" className="video-pixel sprocket" />
          
          {/* Data stream to center */}
          {mounted && (
            <g className="data-stream video-stream">
              <rect width="3" height="3" className="data-packet video-packet">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M68,70 Q60,60 56,52" />
              </rect>
              <rect width="2" height="2" className="data-packet video-packet" style={{ opacity: 0.6 }}>
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.9s" path="M68,70 Q60,60 56,52" />
              </rect>
            </g>
          )}
        </g>

        {/* Connection lines - dashed, subtle */}
        <g className="connection-lines" opacity="0.3">
          <line x1="32" y1="28" x2="44" y2="44" className="connection-line" strokeDasharray="2 2" />
          <line x1="32" y1="72" x2="44" y2="56" className="connection-line" strokeDasharray="2 2" />
          <line x1="68" y1="32" x2="56" y2="44" className="connection-line" strokeDasharray="2 2" />
          <line x1="68" y1="68" x2="56" y2="56" className="connection-line" strokeDasharray="2 2" />
        </g>

        {/* Ambient floating pixels */}
        <g className="ambient-pixels">
          <rect x="8" y="50" width="2" height="2" className="ambient-pixel" style={{ animationDelay: "0s" }} />
          <rect x="92" y="50" width="2" height="2" className="ambient-pixel" style={{ animationDelay: "0.5s" }} />
          <rect x="50" y="8" width="2" height="2" className="ambient-pixel" style={{ animationDelay: "1s" }} />
          <rect x="50" y="90" width="2" height="2" className="ambient-pixel" style={{ animationDelay: "1.5s" }} />
          <rect x="20" y="50" width="2" height="2" className="ambient-pixel" style={{ animationDelay: "2s" }} />
          <rect x="80" y="50" width="2" height="2" className="ambient-pixel" style={{ animationDelay: "2.5s" }} />
        </g>
      </svg>
    </div>
  );
}
