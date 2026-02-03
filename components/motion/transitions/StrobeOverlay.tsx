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
  opacity: number
}

export default function StrobeOverlay({ phase, onEnterComplete, onExitComplete }: StrobeOverlayProps) {
  const [visible, setVisible] = useState(true)

  const onEnterRef = useRef(onEnterComplete)
  onEnterRef.current = onEnterComplete
  const onExitRef = useRef(onExitComplete)
  onExitRef.current = onExitComplete

  // Generate warp fragment shards
  const fragments = useMemo<Fragment[]>(() => {
    const count = 45 + Math.floor(Math.random() * 15)
    return Array.from({ length: count }, () => ({
      angle: Math.random() * 360,
      distance: 30 + Math.random() * 70,
      size: 1 + Math.random() * 3.5,
      length: 8 + Math.random() * 55,
      brightness: 0.15 + Math.random() * 0.85,
      delay: Math.random() * 150,
      duration: 350 + Math.random() * 300,
    }))
  }, [])

  // Generate radial speed streaks (evenly-ish distributed)
  const streaks = useMemo<Streak[]>(() => {
    const count = 28
    return Array.from({ length: count }, (_, i) => ({
      angle: (i * 360 / count) + (Math.random() - 0.5) * 10,
      delay: Math.random() * 120,
      length: 25 + Math.random() * 50,
      opacity: 0.15 + Math.random() * 0.35,
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
