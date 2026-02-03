'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect, useRef } from 'react';
import styles from './PageTransition.module.css';

const GLITCH_DURATION = 0.45; // seconds for full glitch cycle

// Glitch overlay: black screen + noise + scanlines + slices
const glitchOverlayVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 1, 0.8, 0],
    transition: {
      duration: GLITCH_DURATION,
      times: [0, 0.05, 0.5, 0.75, 1],
      ease: 'linear',
    },
  },
  exit: {
    opacity: [0, 1, 1, 0.6, 0],
    transition: {
      duration: GLITCH_DURATION * 0.8,
      times: [0, 0.1, 0.4, 0.7, 1],
      ease: 'linear',
    },
  },
};

// Page content: distort on exit, resolve on enter
const pageContentVariants = {
  initial: {
    opacity: 0,
    x: 0,
    skewX: 0,
    filter: 'blur(0px) brightness(1)',
  },
  animate: {
    opacity: 1,
    x: 0,
    skewX: 0,
    filter: 'blur(0px) brightness(1)',
    transition: {
      duration: 0.35,
      delay: GLITCH_DURATION * 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: [1, 1, 0.5, 0],
    x: [0, -8, 12, -4, 0],
    skewX: [0, -1.5, 2, -0.5, 0],
    filter: [
      'blur(0px) brightness(1)',
      'blur(1px) brightness(1.3)',
      'blur(3px) brightness(0.8)',
      'blur(6px) brightness(0.3)',
    ],
    transition: {
      duration: GLITCH_DURATION * 0.7,
      ease: 'linear',
    },
  },
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isGlitching, setIsGlitching] = useState(false);
  const prevPathRef = useRef(pathname);

  // Trigger glitch class on page content during transition
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      setIsGlitching(true);
      const timer = setTimeout(() => setIsGlitching(false), GLITCH_DURATION * 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} className={styles.transitionWrapper}>
        {/* Glitch overlay */}
        <motion.div
          className={styles.glitchOverlay}
          variants={glitchOverlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Scanlines */}
          <div className={styles.scanlines} />

          {/* Noise grain */}
          <div className={styles.noise} />

          {/* Horizontal glitch slices */}
          {[...Array(5)].map((_, i) => (
            <div key={`slice-${i}`} className={styles.glitchSlice} />
          ))}

          {/* Displacement blocks */}
          {[...Array(3)].map((_, i) => (
            <div key={`displace-${i}`} className={styles.displaceBlock} />
          ))}
        </motion.div>

        {/* Page content */}
        <motion.div
          variants={pageContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`${styles.pageContent} ${isGlitching ? styles.glitching : ''}`}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
