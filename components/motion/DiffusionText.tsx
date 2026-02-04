"use client";

import React, { useEffect, useState, useRef } from "react";

export type DiffusionVariant = "diffusion" | "morph";

interface DiffusionTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  variant?: DiffusionVariant;
  paused?: boolean;
}

const GLYPHS = "█▓▒░>_[]{}—+*!#&";

const CJK    = "感觉构建探索未来智慧视觉语言模型认识思维预测";
const KANA   = "アイウエオカキクケコサシスセソタチツテト";
const BLOCKS = "░▒▓█▄▀";

const _hash = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export function DiffusionText({ 
  text, 
  className = "", 
  revealSpeed = 1500,
  variant = "diffusion",
  paused = false,
}: DiffusionTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const prevTextRef = useRef(text);
  const isMounted = useRef(false);

  useEffect(() => {
    if (paused) {
      setDisplayText(text);
      return;
    }
  }, [paused, text]);
  
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (paused) return;

    const prevText = prevTextRef.current;
    prevTextRef.current = text;
    
    let startTime = 0;
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / revealSpeed, 1);
      
      let currentString = "";
      let morphDuration = 0;

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
        // --- Variant B: Broken neon / malfunctioning CJK display ---
        const length = Math.max(prevText.length, text.length);
        const chars: string[] = [];
        const stagger = 680;
        let morphEnd = 0;

        for (let i = 0; i < length; i++) {
          const targetChar = text[i] || "";
          const oldChar = prevText[i] || "";

          if (targetChar === oldChar) {
            chars.push(targetChar);
            continue;
          }

          const jitter = (_hash(i * 7 + 3) - 0.5) * 260;
          const charDelay = i * stagger + jitter;
          const t = elapsed - charDelay;

          const entryFlicker   = 200 + _hash(i * 11) * 150;
          const cjk1Hold       = 1100 + _hash(i * 13) * 800;
          const hasFlickerBack = _hash(i * 17) > 0.2;
          const flickerBack    = hasFlickerBack ? 140 + _hash(i * 19) * 120 : 0;
          const cjk2Hold       = hasFlickerBack ? 800 + _hash(i * 23) * 600 : 0;
          const hasStutter     = _hash(i * 53) > 0.55;
          const stutterHold    = hasStutter ? 350 + _hash(i * 59) * 350 : 0;
          const settleGlitch   = 100 + _hash(i * 29) * 80;

          const t1 = entryFlicker;
          const t2 = t1 + cjk1Hold;
          const t3 = t2 + flickerBack;
          const t4 = t3 + cjk2Hold;
          const t5 = t4 + stutterHold;
          const t6 = t5 + settleGlitch;

          const charEnd = charDelay + t6;
          if (charEnd > morphEnd) morphEnd = charEnd;

          if (t < 0) {
            chars.push(oldChar);
          } else if (t < t1) {
            const tick = Math.floor(t / 80);
            chars.push(
              tick % 2 === 0
                ? oldChar
                : BLOCKS[Math.floor(_hash(i * 31 + tick) * BLOCKS.length)]
            );
          } else if (t < t2) {
            chars.push(CJK[Math.floor(_hash(i * 37 + 1) * CJK.length)]);
          } else if (t < t3 && hasFlickerBack) {
            chars.push(oldChar);
          } else if (t < t4 && hasFlickerBack) {
            const pool = _hash(i * 41) > 0.5 ? KANA : CJK;
            chars.push(pool[Math.floor(_hash(i * 43 + 2) * pool.length)]);
          } else if (t < t5 && hasStutter) {
            const tick = Math.floor((t - t4) / 160);
            chars.push(
              tick % 2 === 0
                ? targetChar
                : CJK[Math.floor(_hash(i * 61 + 3) * CJK.length)]
            );
          } else if (t < t6) {
            const tick = Math.floor((t - t5) / 50);
            chars.push(
              tick % 2 === 0
                ? targetChar
                : BLOCKS[Math.floor(_hash(i * 47 + tick) * BLOCKS.length)]
            );
          } else {
            chars.push(targetChar);
          }
        }

        currentString = chars.join('');
        morphDuration = morphEnd;
      }
      
      setDisplayText(currentString);

      const done = variant === "morph"
        ? elapsed >= morphDuration
        : rawProgress >= 1;

      if (done) {
        setDisplayText(text);
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [text, revealSpeed, variant, paused]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
