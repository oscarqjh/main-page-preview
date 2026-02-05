import type { Metadata } from "next";
import { Suspense } from "react";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { TransitionProvider } from "@/components/motion/TransitionSystem";
import PageTransition from "@/components/motion/PageTransition";

export const metadata: Metadata = {
	title: "LMMs-Lab",
	description: "Large Multimodal Models Research Lab",
	icons: {
		icon: '/icon.png',
	}
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
				<link rel="preload" href="/videos/hero-promo.mp4" as="video" type="video/mp4" />
			</head>
			<body>
				<MotionProvider>
					<Suspense fallback={null}>
						<TransitionProvider>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									minHeight: "100vh",
								}}
							>
								<Header />
								<main style={{ flex: 1 }}>
									<PageTransition>
										{children}
									</PageTransition>
								</main>
								<Footer />
							</div>
						</TransitionProvider>
					</Suspense>
				</MotionProvider>
			</body>
		</html>
	);
}
