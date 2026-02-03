export type TransitionPhase =
  | 'idle'
  | 'punk'
  | 'big-enter'
  | 'page-swap'
  | 'big-exit'

export type BigTransitionType = 'strobing' | 'hacking' | 'smooth'

export interface TransitionCombo {
  punk: boolean
  big: BigTransitionType | null
}

export interface TransitionState {
  phase: TransitionPhase
  combo: TransitionCombo | null
  href: string | null
  clickRect: DOMRect | null
  clickText: string | null
  clickStyles: CSSStyleDeclaration | null
}

export interface TransitionContextValue {
  triggerTransition: (
    href: string,
    element: HTMLElement,
    rect: DOMRect
  ) => void
  phase: TransitionPhase
}
