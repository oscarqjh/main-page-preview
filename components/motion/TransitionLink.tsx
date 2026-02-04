'use client'

import Link, { type LinkProps } from 'next/link'
import { motion } from 'framer-motion'
import { type ReactNode, type ComponentProps, useCallback } from 'react'
import { linkVariants } from './variants'
import { useTransition } from './TransitionContext'

type TransitionLinkProps = LinkProps & ComponentProps<'a'> & {
  children: ReactNode
  className?: string
  href: string
  style?: React.CSSProperties
}

export default function TransitionLink({ children, className, style, onClick, ...props }: TransitionLinkProps) {
  const { triggerTransition, phase } = useTransition()

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      onClick?.(e)
      return
    }

    if (phase !== 'idle') {
      e.preventDefault()
      return
    }

    e.preventDefault()

    const target = e.currentTarget
    const rect = target.getBoundingClientRect()

    triggerTransition(props.href, target, rect)
    onClick?.(e)
  }, [triggerTransition, phase, props.href, onClick])

  return (
    <motion.div
      variants={linkVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      style={style}
    >
      <Link 
        className={className} 
        {...props} 
        onClick={handleClick}
        prefetch={true}
      >
        {children}
      </Link>
    </motion.div>
  )
}
