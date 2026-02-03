import { useEffect, useRef, useState, useMemo } from 'react'
import { TRANSITION_TIMING } from '../variants'
import styles from './StrobeOverlay.module.css'

interface StrobeOverlayProps {
  phase: 'enter' | 'exit'
  onEnterComplete: () => void
  onExitComplete: () => void
}

interface Fragment {
  angle: number
  distance: number
  size: number
  length: number
  brightness: number
  delay: number
  duration: number
}

interface Streak {
  angle: number
  delay: number
  length: number
  thickness: number
  opacity: number
}

export default function StrobeOverlay({ phase, onEnterComplete, onExitComplete }: StrobeOverlayProps) {
  const [visible, setVisible] = useState(true)

  const onEnterRef = useRef(onEnterComplete)
  onEnterRef.current = onEnterComplete
  const onExitRef = useRef(onExitComplete)
  onExitRef.current = onExitComplete

  const noiseSeed = useMemo(() => Math.floor(Math.random() * 999), [])

  // Dense field of warp fragment shards - three layers for depth
  const fragments = useMemo<Fragment[]>(() => {
    const items: Fragment[] = []
    // Layer 1: far / thin / fast (background debris)
    for (let i = 0; i < 30; i++) {
      items.push({
        angle: Math.random() * 360,
        distance: 60 + Math.random() * 40,
        size: 1 + Math.random() * 1.5,
        length: 20 + Math.random() * 60,
        brightness: 0.3 + Math.random() * 0.4,
        delay: Math.random() * 100,
        duration: 300 + Math.random() * 200,
      })
    }
    // Layer 2: mid-range / medium / moderate
    for (let i = 0; i < 25; i++) {
      items.push({
        angle: Math.random() * 360,
        distance: 35 + Math.random() * 45,
        size: 2 + Math.random() * 3,
        length: 30 + Math.random() * 80,
        brightness: 0.5 + Math.random() * 0.5,
        delay: 30 + Math.random() * 120,
        duration: 350 + Math.random() * 250,
      })
    }
    // Layer 3: close / thick / bright (hero fragments)
    for (let i = 0; i < 15; i++) {
      items.push({
        angle: Math.random() * 360,
        distance: 25 + Math.random() * 50,
        size: 3 + Math.random() * 5,
        length: 40 + Math.random() * 100,
        brightness: 0.7 + Math.random() * 0.3,
        delay: Math.random() * 80,
        duration: 400 + Math.random() * 250,
      })
    }
    return items
  }, [])

  // Dense radial speed streaks
  const streaks = useMemo<Streak[]>(() => {
    const count = 40
    return Array.from({ length: count }, (_, i) => ({
      angle: (i * 360 / count) + (Math.random() - 0.5) * 6,
      delay: Math.random() * 100,
      length: 30 + Math.random() * 55,
      thickness: 1 + Math.random() * 2,
      opacity: 0.25 + Math.random() * 0.5,
    }))
  }, [])

  useEffect(() => {
    if (phase === 'enter') {
      const t = setTimeout(() => onEnterRef.current(), TRANSITION_TIMING.STROBE_ENTER)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setVisible(false)
        onExitRef.current()
      }, TRANSITION_TIMING.STROBE_EXIT)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (!visible) return null

  return (
    <div className={`${styles.overlay} ${phase === 'exit' ? styles.exiting : ''}`}>
      {/* 1-bit dithering noise grain */}
      <svg className={styles.ditherNoise} aria-hidden="true">
        <filter id="warp-dither">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed={noiseSeed} />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#warp-dither)" />
      </svg>

      {/* Radial scanlines for CRT texture */}
      <div className={styles.scanlines} />

      <div className={styles.warpCenter}>
        {/* Radial speed streaks */}
        {streaks.map((s, i) => (
          <div
            key={`s-${i}`}
            className={styles.streak}
            style={{
              '--angle': `${s.angle}deg`,
              '--delay': `${s.delay}ms`,
              '--length': `${s.length}vmax`,
              '--thickness': `${s.thickness}px`,
              '--streak-opacity': s.opacity,
            } as React.CSSProperties}
          />
        ))}

        {/* Fragment shards flying toward center */}
        {fragments.map((f, i) => (
          <div
            key={`f-${i}`}
            className={styles.fragment}
            style={{
              '--angle': `${f.angle}deg`,
              '--dist': `${f.distance}vmax`,
              '--size': `${f.size}px`,
              '--length': `${f.length}px`,
              '--brightness': f.brightness,
              '--delay': `${f.delay}ms`,
              '--duration': `${f.duration}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Central dark void */}
      <div className={styles.vignette} />
    </div>
  )
}
