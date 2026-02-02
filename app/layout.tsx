import type { Metadata } from "next";
import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageTransition from "@/components/motion/PageTransition";

export const metadata: Metadata = {
	title: "LMMs-Lab",
	description: "Large Multimodal Models Research Lab",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						minHeight: "100vh",
					}}
				>
					<Header />
					<main style={{ flex: 1 }}>
						<PageTransition>{children}</PageTransition>
					</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
