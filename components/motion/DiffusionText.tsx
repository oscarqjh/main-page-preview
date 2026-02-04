"use client";

import React, { useEffect, useState, useRef } from "react";

export type DiffusionVariant = "diffusion" | "morph";

interface DiffusionTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  variant?: DiffusionVariant;
}

const GLYPHS = "█▓▒░>_[]{}—+*!#&";
const SCRAMBLE = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  + "智慧感知构建探索未来视觉语言模型認識機器學習預測訓練網絡運算維度張量梯度損失權重"
  + "░▒▓█▄▀▐▌╔╗╚╝║═╬┼┤├┴┬─│";

export function DiffusionText({ 
  text, 
  className = "", 
  revealSpeed = 1500,
  variant = "diffusion"
}: DiffusionTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const prevTextRef = useRef(text);
  const isMounted = useRef(false);
  
  useEffect(() => {
    // Skip animation on first mount to show initial text immediately
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const prevText = prevTextRef.current;
    prevTextRef.current = text;
    
    let startTime = 0;
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / revealSpeed, 1);
      
      let currentString = "";

      if (variant === "diffusion") {
        // --- Variant A: Diffusion (Matrix/Glitch style) ---
        // Center-out reveal with heavy noise
        const progress = 1 - Math.pow(1 - rawProgress, 3); // Ease out
        const chars = text.split('');
        
        currentString = chars.map((char, index) => {
          if (char === " " || char === "\n") return char;
          
          const centerOffset = Math.abs(index - text.length / 2) / (text.length / 2);
          const revealThreshold = progress * (1.2 + (1 - centerOffset) * 0.5); 
          
          if (revealThreshold > Math.random() * 0.5 + 0.5) return char;
          if (Math.random() > 0.9) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join('');

      } else {
        // --- Variant B: Character Morph (Slot Machine / Flip) ---
        // Transition from old char to new char
        // Slower, character-by-character transformation
        const length = Math.max(prevText.length, text.length);
        const chars: string[] = [];
        
        for (let i = 0; i < length; i++) {
          const targetChar = text[i] || "";
          const oldChar = prevText[i] || "";
          
          // Each character has its own "done" time
          // Stagger effect: left to right (or random)
          // Let's do random staggered finish
          const charProgress = Math.min((elapsed - i * 30) / (revealSpeed * 0.6), 1);
          
          if (charProgress >= 1) {
            chars.push(targetChar);
          } else if (charProgress > 0) {
            // In transition
            if (targetChar === oldChar) {
              chars.push(targetChar);
            } else {
              // Show random alphabet during transition (Slot machine)
              // Change char every few frames
              const randomChar = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
              chars.push(randomChar);
            }
          } else {
            // Not started yet
            chars.push(oldChar);
          }
        }
        currentString = chars.join('');
      }
      
      setDisplayText(currentString);
      
      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayText(text); // Finalize
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [text, revealSpeed, variant]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
