"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import MotionLink from "@/components/motion/MotionLink";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Header.module.css";

const navItems = [
	{ label: "Home", href: "/" },
	{ label: "Posts", href: "/posts" },
	{ label: "Notes", href: "/notes" },
	{ label: "About", href: "/about" },
];

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const menuRef = useRef<HTMLDivElement>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Lock body scroll when menu is open
	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [menuOpen]);

	// Focus trap and keyboard handling
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (!menuOpen) return;

		if (e.key === "Escape") {
			setMenuOpen(false);
			menuButtonRef.current?.focus();
			return;
		}

		if (e.key === "Tab" && menuRef.current) {
			const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled])'
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement?.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement?.focus();
			}
		}
	}, [menuOpen]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	// Focus first menu item when opened
	useEffect(() => {
		if (menuOpen && menuRef.current) {
			const firstLink = menuRef.current.querySelector<HTMLElement>('a[href]');
			firstLink?.focus();
		}
	}, [menuOpen]);

	const isActive = (href: string) => {
		if (!mounted) return false;
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	return (
		<header className={styles.masthead}>
			<div className={styles.mastheadInner}>
				<div className={styles.mastheadBrand}>
					<MotionLink href="/" className={styles.brandLink}>
						<Image
							src="/assets/logo.png"
							alt="LMMS Lab Logo"
							width={144}
							height={144}
							className={styles.brandLogo}
							priority
						/>
					</MotionLink>
				</div>

				<button
					ref={menuButtonRef}
					onClick={() => setMenuOpen(!menuOpen)}
					aria-label="Toggle menu"
					aria-expanded={menuOpen}
					aria-controls="mobile-nav-menu"
					className={styles.mobileMenuBtn}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="square"
						strokeLinejoin="miter"
					>
						{menuOpen ? (
							<path d="M18 6L6 18M6 6l12 12" />
						) : (
							<path d="M3 12h18M3 6h18M3 18h18" />
						)}
					</svg>
				</button>

				{/* Desktop Nav */}
				<nav className={`${styles.navMenu} ${styles.desktopNav}`}>
					{navItems.map((item) => (
						<MotionLink
							key={item.href}
							href={item.href}
							className={`${styles.navLink} ${isActive(item.href) ? styles.active : ""}`}
						>
							{item.label}
						</MotionLink>
					))}
				</nav>
			</div>

			{/* Mobile Menu Overlay - Apple-style smooth reveal */}
			<AnimatePresence>
				{menuOpen && (
					<motion.div
						ref={menuRef}
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{
							duration: 0.35,
							ease: [0.25, 0.1, 0.25, 1]
						}}
						className={styles.mobileNavOverlay}
						role="dialog"
						aria-modal="true"
						aria-label="Navigation menu"
					>
						<nav id="mobile-nav-menu" className={styles.mobileNavContent}>
							{navItems.map((item) => (
								<MotionLink
									key={item.href}
									href={item.href}
									onClick={() => setMenuOpen(false)}
									className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.active : ""}`}
								>
									{item.label}
								</MotionLink>
							))}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
