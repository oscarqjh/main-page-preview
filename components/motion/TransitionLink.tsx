'use client'

import Link, { type LinkProps } from 'next/link'
import { motion } from 'framer-motion'
import { type ReactNode, type ComponentProps, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { linkVariants } from './variants'
import { useTransition } from './TransitionSystem'

type TransitionLinkProps = LinkProps & ComponentProps<'a'> & {
  children: ReactNode
  className?: string
  href: string
  style?: React.CSSProperties
}

export default function TransitionLink({ children, className, style, onClick, onMouseEnter, onFocus, ...props }: TransitionLinkProps) {
  const { triggerTransition, phase } = useTransition()
  const router = useRouter()

  const handlePrefetch = useCallback(() => {
    router.prefetch(props.href)
  }, [router, props.href])

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

    triggerTransition(props.href)
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
        onMouseEnter={(e) => {
            handlePrefetch()
            onMouseEnter?.(e)
        }}
        onFocus={(e) => {
            handlePrefetch()
            onFocus?.(e)
        }}
        prefetch={true}
      >
        {children}
      </Link>
    </motion.div>
  )
}
