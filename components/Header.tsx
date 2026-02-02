"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import MotionLink from "@/components/motion/MotionLink";

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
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						{menuOpen ? (
							<path d="M6 6l12 12M6 18L18 6" />
						) : (
							<path d="M4 12h16M4 6h16M4 18h16" />
						)}
					</svg>
				</button>

				<nav className={`nav-menu ${menuOpen ? "nav-open" : ""}`}>
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

		<style jsx>{`
			.masthead {
				padding: 1.25rem 0;
				border-bottom: 1px solid rgba(254, 215, 170, 0.1);
			}

			.masthead-inner {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: var(--space-xl);
				padding: 0 var(--space-md);
				width: 100%;
				max-width: 80rem;
				margin: 0 auto;
			}

			.masthead-brand {
				display: flex;
				flex-direction: column;
				gap: 0;
			}

			.brand-link {
				text-decoration: none;
				color: inherit;
				display: flex;
				flex-direction: row;
				align-items: center;
				line-height: 1;
			}

			.brand-logo {
				width: 144px;
				height: 144px;
				object-fit: contain;
			}

			.brand-link:hover {
				filter: none;
				opacity: 0.9;
			}

			.mobile-menu-btn {
				display: none;
				background: transparent;
				border: none;
				color: inherit;
				cursor: pointer;
				padding: var(--space-sm);
				opacity: 0.7;
				transition: opacity var(--duration-fast) var(--ease-out);
			}

			.mobile-menu-btn:hover {
				opacity: 1;
			}

			.nav-menu {
				display: flex;
				gap: var(--space-xl);
				align-items: center;
			}

			:global(.nav-link) {
				text-decoration: none !important;
				color: inherit;
				font-size: 1.25rem;
				font-weight: 600;
				opacity: 0.7;
				transition: all var(--duration-fast) var(--ease-out);
				letter-spacing: -0.01em;
			}

			:global(.nav-link:hover) {
				opacity: 1;
				filter: none;
			}

			:global(.nav-link.active) {
				opacity: 1;
				font-weight: 700;
			}

			@media (max-width: 768px) {
				.masthead {
					padding: 1rem 0;
				}

				.masthead-inner {
					padding: 0 var(--space-md);
				}

				.brand-logo {
					width: 100px;
					height: 100px;
				}

				.nav-menu {
					gap: var(--space-lg);
				}
			}

			@media (max-width: 640px) {
				.masthead {
					position: relative;
				}

				.masthead-inner {
					flex-wrap: wrap;
				}

				.mobile-menu-btn {
					display: block;
				}

				.nav-menu {
					position: absolute;
					top: 100%;
					left: 0;
					right: 0;
					flex-direction: column;
					align-items: flex-start;
					background: var(--color-bg);
					padding: var(--space-lg) var(--space-xl);
					gap: var(--space-md);
					display: none;
					box-shadow: 0 4px 12px rgba(0,0,0,0.15);
					z-index: var(--z-dropdown, 100);
				}

				.nav-menu.nav-open {
					display: flex;
				}

				:global(.nav-link) {
					display: block;
					width: 100%;
					padding: var(--space-sm) 0;
					font-size: 1.125rem;
				}
			}
		`}</style>
		</header>
	);
}
