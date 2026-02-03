import { Variants, BezierDefinition } from 'framer-motion';

// Apple-style easing curves
export const EASE: BezierDefinition = [0.25, 0.1, 0.25, 1];        // Default Apple ease-out
export const EASE_EXPO: BezierDefinition = [0.16, 1, 0.3, 1];      // Dramatic deceleration
export const EASE_SPRING: BezierDefinition = [0.175, 0.885, 0.32, 1.275]; // Subtle overshoot

export const menuOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASE }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASE }
  }
};

// Apple-style page transitions - subtle, elegant
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(8px)',  // Slightly less blur
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,  // Slightly faster
      ease: EASE,
      delay: 0.15,    // Quicker start
    },
  },
  exit: {
    opacity: 0,
    scale: 1.01,  // More subtle scale on exit
    filter: 'blur(6px)',
    transition: {
      duration: 0.35,
      ease: EASE,
    },
  },
};

// Apple-style staggered reveal
export const shutterContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,  // Slightly longer stagger
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

export const shutterBarVariants: Variants = {
  initial: {
    scaleX: 1,
    originX: 0,
  },
  animate: {
    scaleX: 0,
    originX: 1,
    transition: {
      duration: 0.7,
      ease: EASE,
    },
  },
  exit: {
    scaleX: 1,
    originX: 0,
    transition: {
      duration: 0.45,
      ease: EASE,
    },
  },
};

// Apple-style link interactions - subtle, refined
export const linkVariants: Variants = {
  initial: { opacity: 1 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: EASE
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: EASE
    }
  }
};
