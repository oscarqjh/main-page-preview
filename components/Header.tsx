"use client";

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
		<header className="fixed top-0 left-0 right-0 z-[100] bg-[var(--background)] border-b-2 border-[var(--foreground)] h-16">
			{/* Terminal Grid Layout */}
			<div className="w-full h-full max-w-[80rem] mx-auto px-4 grid grid-cols-[auto_1fr_auto] items-center gap-4" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', height: '100%', maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
				
				{/* 1. Brand (Left) */}
				<div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
					<MotionLink href="/" className="flex items-center gap-2 group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
						<div style={{ width: '2rem', height: '2rem', border: '1px solid var(--foreground)', position: 'relative', background: 'var(--foreground)' }}>
							{/* 1-bit Icon Placeholder */}
							<div style={{ position: 'absolute', inset: '2px', border: '1px solid var(--background)' }} />
						</div>
						<span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.125rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
							LMMS-LAB
						</span>
					</MotionLink>
				</div>

				{/* 2. System Status (Center) - Decorative */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--foreground)' }} className="hidden-mobile">
					<span style={{ marginRight: '0.5rem', animation: 'pulse 2s infinite' }}>●</span> SYSTEM ONLINE
				</div>

				{/* 3. Navigation (Right) */}
				<nav className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
					{navItems.map((item) => (
						<MotionLink
							key={item.href}
							href={item.href}
							style={{ 
								fontFamily: 'var(--font-mono)', 
								fontSize: '0.875rem', 
								fontWeight: 700, 
								textTransform: 'uppercase', 
								letterSpacing: '0.05em',
								textDecoration: isActive(item.href) ? 'underline' : 'none',
								textUnderlineOffset: '4px',
								color: 'var(--foreground)',
								opacity: isActive(item.href) ? 1 : 0.6
							}}
						>
							[{item.label}]
						</MotionLink>
					))}
				</nav>

				{/* Mobile Menu Button */}
				<button
					onClick={() => setMenuOpen(!menuOpen)}
					className="mobile-only"
					style={{ 
						background: 'transparent', 
						border: '1px solid var(--foreground)', 
						color: 'var(--foreground)', 
						padding: '0.5rem 1rem', 
						cursor: 'pointer',
						fontFamily: 'var(--font-mono)',
						fontSize: '0.75rem',
						fontWeight: 700,
						textTransform: 'uppercase'
					}}
					aria-label="Toggle menu"
				>
					{menuOpen ? "CLOSE" : "MENU"}
				</button>
			</div>

			{/* Mobile Menu Overlay (Cyberpunk Curtain) */}
			<AnimatePresence>
				{menuOpen && (
					<motion.div
						initial={{ clipPath: "inset(0 0 100% 0)" }}
						animate={{ clipPath: "inset(0 0 0% 0)" }}
						exit={{ clipPath: "inset(100% 0 0 0)" }}
						transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
						style={{
							position: 'fixed',
							top: '64px', // Below header
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: 'var(--background)',
							zIndex: 50,
							display: 'flex',
							flexDirection: 'column',
							padding: '2rem',
							borderTop: '2px solid var(--foreground)'
						}}
					>
						{/* Background Grid */}
						<div style={{ 
								position: 'absolute',
								inset: 0,
								pointerEvents: 'none',
								opacity: 0.1,
								backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
								backgroundSize: '40px 40px'
							}} 
						/>

						<nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 10 }}>
							{navItems.map((item) => (
								<MotionLink
									key={item.href}
									href={item.href}
									onClick={() => setMenuOpen(false)}
									style={{
										fontFamily: 'var(--font-mono)',
										fontSize: '2rem',
										fontWeight: 900,
										textTransform: 'uppercase',
										letterSpacing: '-0.02em',
										color: 'var(--foreground)',
										textDecoration: 'none',
										opacity: isActive(item.href) ? 1 : 0.5,
										borderLeft: isActive(item.href) ? '4px solid var(--foreground)' : '4px solid transparent',
										paddingLeft: isActive(item.href) ? '1rem' : '0',
										transition: 'all 0.3s ease'
									}}
								>
									{item.label}
								</MotionLink>
							))}
						</nav>

						<div style={{ marginTop: 'auto', position: 'relative', zIndex: 10, borderTop: '1px solid var(--foreground)', paddingTop: '1.5rem', opacity: 0.6, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--foreground)' }}>
							<p>LMMS-LAB // VISUAL INTERFACE V2.0</p>
							<p style={{ marginTop: '0.5rem' }}>EST. 2024</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<style jsx global>{`
				.hidden-mobile {
					display: flex;
				}
				.mobile-only {
					display: none;
				}
				@media (max-width: 768px) {
					.hidden-mobile {
						display: none !important;
					}
					.mobile-only {
						display: block !important;
					}
				}
				@keyframes pulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.3; }
				}
			`}</style>
		</header>
	);
}
