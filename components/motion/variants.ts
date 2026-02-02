import { Variants, BezierDefinition } from 'framer-motion';

export const EASE: BezierDefinition = [0.76, 0, 0.24, 1];

export const menuOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: EASE,
      delay: 0.2, 
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: EASE,
    },
  },
};

export const shutterContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
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
      duration: 0.8,
      ease: EASE,
    },
  },
  exit: {
    scaleX: 1,
    originX: 0,
    transition: {
      duration: 0.5,
      ease: EASE,
    },
  },
};

export const linkVariants: Variants = {
  initial: { opacity: 1 },
  hover: {
    opacity: 0.8,
    transition: { duration: 0.1 }
  },
  tap: {
    scale: 0.95,
  }
};
