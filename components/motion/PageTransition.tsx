'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { pageVariants, shutterContainerVariants, shutterBarVariants } from './variants';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} className="relative w-full">
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex flex-col h-screen"
          variants={shutterContainerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 w-full bg-[#0369a1] border-b border-[#fed7aa]/10"
              variants={shutterBarVariants}
            />
          ))}
        </motion.div>
        
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="will-change-transform w-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
