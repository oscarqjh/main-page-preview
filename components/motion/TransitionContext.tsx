'use client'

import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { TransitionPhase, TransitionCombo, BigTransitionType, TransitionContextValue } from './transitions/types'
import { TRANSITION_TIMING } from './variants'
import PunkScramble from './transitions/PunkScramble'
import StrobeOverlay from './transitions/StrobeOverlay'
import HackingOverlay from './transitions/HackingOverlay'
import AmbientGlitch from './transitions/AmbientGlitch'

const TransitionCtx = createContext<TransitionContextValue>({
  triggerTransition: () => {},
  phase: 'idle',
})

export function useTransition() {
  return useContext(TransitionCtx)
}

// Max time before force-resetting to idle (deadman switch)
const DEADMAN_MS = 6000

function pickCombo(): TransitionCombo | null {
  const punk = Math.random() < 0.2  // 20% punk text scramble
  // 3% big transition (easter egg): ~30% rift, ~70% hacking
  const big: BigTransitionType | null =
    Math.random() < 0.03
      ? (Math.random() < 0.3 ? 'strobing' : 'hacking')
      : null

  // Nothing triggered -> plain navigation
  if (!punk && !big) return null
  return { punk, big }
}

interface ProviderState {
  phase: TransitionPhase
  combo: TransitionCombo | null
  href: string | null
  clickRect: DOMRect | null
  clickText: string | null
  clickStyles: CSSStyleDeclaration | null
  bigPhase: 'enter' | 'exit'
  hiddenElement: HTMLElement | null
}

const IDLE_STATE: ProviderState = {
  phase: 'idle',
  combo: null,
  href: null,
  clickRect: null,
  clickText: null,
  clickStyles: null,
  bigPhase: 'enter',
  hiddenElement: null,
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<ProviderState>(IDLE_STATE)
  const stateRef = useRef(state)
  stateRef.current = state
  const deadmanRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Deadman switch: force-reset if transition jams
  useEffect(() => {
    if (state.phase !== 'idle') {
      deadmanRef.current = setTimeout(() => {
        // Restore any hidden element before force-reset
        if (stateRef.current.hiddenElement) {
          stateRef.current.hiddenElement.style.visibility = ''
        }
        setState(IDLE_STATE)
      }, DEADMAN_MS)
    } else {
      if (deadmanRef.current) {
        clearTimeout(deadmanRef.current)
        deadmanRef.current = null
      }
    }
    return () => {
      if (deadmanRef.current) {
        clearTimeout(deadmanRef.current)
        deadmanRef.current = null
      }
    }
  }, [state.phase])

  const triggerTransition = useCallback((href: string, element: HTMLElement, rect: DOMRect) => {
    if (stateRef.current.phase !== 'idle') return

    const combo = pickCombo()

    // 97% of the time: plain navigation, no effects
    if (!combo) {
      router.push(href)
      return
    }

    const text = (element.textContent || '').trim()
    const computedStyles = window.getComputedStyle(element)

    // Only use punk when there's actual text to scramble (skip for images/icons)
    const usePunk = combo.punk && text.length > 0

    if (usePunk) {
      element.style.visibility = 'hidden'
      setState({
        phase: 'punk',
        combo,
        href,
        clickRect: rect,
        clickText: text,
        clickStyles: computedStyles,
        bigPhase: 'enter',
        hiddenElement: element,
      })
    } else if (combo.big) {
      setState({
        phase: 'big-enter',
        combo,
        href,
        clickRect: null,
        clickText: null,
        clickStyles: null,
        bigPhase: 'enter',
        hiddenElement: null,
      })
    } else {
      // punk was requested but no text available, no big -> plain navigate
      router.push(href)
    }
  }, [router])

  const onPunkComplete = useCallback(() => {
    if (stateRef.current.hiddenElement) {
      stateRef.current.hiddenElement.style.visibility = ''
    }
    // If no big transition, just navigate and reset
    if (!stateRef.current.combo?.big) {
      if (stateRef.current.href) {
        router.push(stateRef.current.href)
      }
      setState(IDLE_STATE)
      return
    }
    setState(prev => ({
      ...prev,
      phase: 'big-enter',
      bigPhase: 'enter',
      hiddenElement: null,
    }))
  }, [router])

  const onBigEnterComplete = useCallback(() => {
    if (stateRef.current.href) {
      router.push(stateRef.current.href)
    }
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        phase: 'big-exit',
        bigPhase: 'exit',
      }))
    }, TRANSITION_TIMING.PAGE_SWAP_BUFFER)
  }, [router])

  const onBigExitComplete = useCallback(() => {
    setState(IDLE_STATE)
  }, [])

  return (
    <TransitionCtx.Provider value={{ triggerTransition, phase: state.phase }}>
      {children}

      {/* Punk scramble overlay */}
      {state.phase === 'punk' && state.clickRect && state.clickText && state.clickStyles && (
        <PunkScramble
          rect={state.clickRect}
          text={state.clickText}
          computedStyles={state.clickStyles}
          onComplete={onPunkComplete}
        />
      )}

      {/* Strobing overlay */}
      {(state.phase === 'big-enter' || state.phase === 'big-exit') && state.combo?.big === 'strobing' && (
        <StrobeOverlay
          phase={state.bigPhase}
          onEnterComplete={onBigEnterComplete}
          onExitComplete={onBigExitComplete}
        />
      )}

      {/* Hacking overlay */}
      {(state.phase === 'big-enter' || state.phase === 'big-exit') && state.combo?.big === 'hacking' && (
        <HackingOverlay
          phase={state.bigPhase}
          onEnterComplete={onBigEnterComplete}
          onExitComplete={onBigExitComplete}
        />
      )}
      {/* Ambient idle glitch (only when no transition running) */}
      <AmbientGlitch active={state.phase === 'idle'} />
    </TransitionCtx.Provider>
  )
}
