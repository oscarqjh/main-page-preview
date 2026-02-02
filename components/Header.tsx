"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import MotionLink from "@/components/motion/MotionLink";
import { AnimatePresence, motion } from "framer-motion";

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

	const isActive = (href: string) => {
		if (!mounted) return false;
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	return (
		<header className="masthead">
			<div className="masthead-inner">
				<div className="masthead-brand">
					<MotionLink href="/" className="brand-link">
						<Image
							src="/assets/logo.png"
							alt="LMMS Lab Logo"
							width={144}
							height={144}
							className="brand-logo"
							priority
						/>
					</MotionLink>
				</div>

				<button
					onClick={() => setMenuOpen(!menuOpen)}
					aria-label="Toggle menu"
					aria-expanded={menuOpen}
					className="mobile-menu-btn"
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
				<nav className="nav-menu desktop-nav">
					{navItems.map((item) => (
						<MotionLink
							key={item.href}
							href={item.href}
							className={`nav-link ${isActive(item.href) ? "active" : ""}`}
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
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{
							duration: 0.35,
							ease: [0.25, 0.1, 0.25, 1]  // Apple ease-out
						}}
						className="mobile-nav-overlay"
					>
						<nav className="mobile-nav-content">
							{navItems.map((item) => (
								<MotionLink
									key={item.href}
									href={item.href}
									onClick={() => setMenuOpen(false)}
									className={`mobile-nav-link ${isActive(item.href) ? "active" : ""}`}
								>
									{item.label}
								</MotionLink>
							))}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>

			<style jsx>{`
				.masthead {
					padding: 1.5rem 0;
					border-bottom: 1px solid rgba(254, 215, 170, 0.1);
					position: relative;
					z-index: 100;
					background: var(--background);
				}

				.masthead-inner {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					max-width: 80rem;
					margin: 0 auto;
					padding: 0 2rem;
				}

				.masthead-brand {
					display: flex;
					align-items: center;
				}

				.brand-link {
					display: block;
					line-height: 0;
				}

				.brand-logo {
					width: auto;
					height: 32px;
					object-fit: contain;
				}

				.nav-menu {
					display: flex;
					gap: 2rem;
					align-items: center;
				}

				/* Use :global to target MotionLink children */
				/* Apple-style transitions: 200ms with smooth ease-out */
				:global(.nav-link) {
					font-family: var(--font-sans);
					font-size: var(--text-caption);  /* Level 5: 16px minimum */
					font-weight: 500;
					text-transform: uppercase;
					letter-spacing: 0.05em;
					color: var(--foreground);
					text-decoration: none;
					opacity: 0.6;
					transition: opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
				}

				:global(.nav-link:hover),
				:global(.nav-link.active) {
					opacity: 1;
				}

				.mobile-menu-btn {
					display: none;
					background: transparent;
					border: none;
					color: var(--foreground);
					cursor: pointer;
					padding: 0.5rem;
				}

				.mobile-nav-overlay {
					position: absolute;
					top: 100%;
					left: 0;
					right: 0;
					background: var(--background);
					border-bottom: 1px solid rgba(254, 215, 170, 0.1);
					padding: 2rem;
					box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2);
				}

				.mobile-nav-content {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
					align-items: flex-start;
				}

				:global(.mobile-nav-link) {
					font-family: var(--font-sans);
					font-size: var(--text-subheading);  /* Level 3: 24px */
					font-weight: 700;
					text-transform: uppercase;
					color: var(--foreground);
					text-decoration: none;
					opacity: 0.7;
				}

				:global(.mobile-nav-link.active) {
					opacity: 1;
					text-decoration: underline;
					text-underline-offset: 4px;
				}

				@media (max-width: 768px) {
					.desktop-nav {
						display: none;
					}
					.mobile-menu-btn {
						display: block;
					}
					.masthead {
						padding: 1rem 0;
					}
					.masthead-inner {
						padding: 0 1.5rem;
					}
				}
			`}</style>
		</header>
	);
}
