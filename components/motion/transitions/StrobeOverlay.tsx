import { useEffect, useRef, useState } from 'react'
import { TRANSITION_TIMING } from '../variants'
import styles from './StrobeOverlay.module.css'

interface StrobeOverlayProps {
  phase: 'enter' | 'exit'
  onEnterComplete: () => void
  onExitComplete: () => void
}

export default function StrobeOverlay({ phase, onEnterComplete, onExitComplete }: StrobeOverlayProps) {
  const [visible, setVisible] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onEnterRef = useRef(onEnterComplete)
  onEnterRef.current = onEnterComplete
  const onExitRef = useRef(onExitComplete)
  onExitRef.current = onExitComplete

  // Draw the dithered data-stream rift texture
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Half resolution for chunky pixel aesthetic
    const scale = 0.5
    const cw = Math.floor(window.innerWidth * scale)
    const ch = Math.floor(window.innerHeight * scale)
    canvas.width = cw
    canvas.height = ch

    const cx = cw / 2
    const imageData = ctx.createImageData(cw, ch)
    const data = imageData.data

    // Pre-compute horizontal band density variation (sine modulation)
    const bandDensity = new Float32Array(ch)
    for (let y = 0; y < ch; y++) {
      bandDensity[y] = 0.35 +
        0.2 * Math.sin(y * 0.07 + Math.random() * 6.28) +
        0.15 * Math.sin(y * 0.17 + Math.random() * 6.28) +
        0.1 * Math.sin(y * 0.41 + Math.random() * 6.28)
      // Random dark band gaps
      if (Math.random() < 0.06) bandDensity[y] *= 0.05
    }

    // Main particle field: horizontal data streams with gaussian density from center
    for (let y = 0; y < ch; y++) {
      // Scanline gap every 3rd row
      if (y % 3 === 0) continue

      const rowDensity = bandDensity[y]

      for (let x = 0; x < cw; x++) {
        const dx = (x - cx) / (cw / 2)
        // Gaussian falloff: dense at center, sparse at edges
        const density = Math.exp(-dx * dx * 3.5) * rowDensity

        if (Math.random() < density) {
          const idx = (y * cw + x) * 4
          const brightness = 180 + Math.floor(Math.random() * 75)
          data[idx] = brightness
          data[idx + 1] = brightness
          data[idx + 2] = brightness
          data[idx + 3] = Math.floor((0.25 + Math.random() * 0.75) * 255)
        }
      }
    }

    // Wider horizontal data-band streaks (occasional bright runs)
    for (let i = 0; i < 20; i++) {
      const bandY = Math.floor(Math.random() * ch)
      const bandH = 1 + Math.floor(Math.random() * 2)
      const offset = (Math.random() - 0.5) * cw * 0.25
      const bandW = 15 + Math.random() * 80
      const x0 = Math.max(0, Math.floor(cx + offset - bandW / 2))
      const x1 = Math.min(cw, Math.ceil(cx + offset + bandW / 2))

      for (let y = bandY; y < Math.min(ch, bandY + bandH); y++) {
        for (let x = x0; x < x1; x++) {
          if (Math.random() < 0.65) {
            const idx = (y * cw + x) * 4
            data[idx] = 255
            data[idx + 1] = 255
            data[idx + 2] = 255
            data[idx + 3] = Math.floor((0.25 + Math.random() * 0.5) * 255)
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // Central vertical beam with warm glow
    const beamW = Math.max(30, cw * 0.04)
    const beamGrad = ctx.createLinearGradient(cx - beamW, 0, cx + beamW, 0)
    beamGrad.addColorStop(0, 'rgba(255,245,220,0)')
    beamGrad.addColorStop(0.3, 'rgba(255,245,220,0.02)')
    beamGrad.addColorStop(0.44, 'rgba(255,248,230,0.12)')
    beamGrad.addColorStop(0.49, 'rgba(255,252,240,0.7)')
    beamGrad.addColorStop(0.5, 'rgba(255,255,250,1)')
    beamGrad.addColorStop(0.51, 'rgba(255,252,240,0.7)')
    beamGrad.addColorStop(0.56, 'rgba(255,248,230,0.12)')
    beamGrad.addColorStop(0.7, 'rgba(255,245,220,0.02)')
    beamGrad.addColorStop(1, 'rgba(255,245,220,0)')
    ctx.fillStyle = beamGrad
    ctx.fillRect(cx - beamW, 0, beamW * 2, ch)
  }, [])

  // Phase timers
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
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
