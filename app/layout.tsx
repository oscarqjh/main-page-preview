import type { Metadata } from "next";
import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { TransitionProvider } from "@/components/motion/TransitionContext";
import PageTransition from "@/components/motion/PageTransition";

export const metadata: Metadata = {
	title: "LMMs-Lab",
	description: "Large Multimodal Models Research Lab",
	icons: {
		icon: [
			{ url: '/icon.svg', type: 'image/svg+xml' },
			{ url: '/favicon.ico', sizes: 'any' }
		],
	}
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<MotionProvider>
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
				</MotionProvider>
			</body>
		</html>
	);
}
