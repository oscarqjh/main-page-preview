import Link from "next/link";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			style={{
				padding: "var(--space-lg) 0",
				marginTop: "auto",
				boxShadow: "inset 0 1px 0 0 currentColor",
			}}
		>
			<div
				className="container"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "var(--space-md)",
				}}
			>
				<nav
					style={{
						display: "flex",
						gap: "var(--space-lg)",
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					<Link href="https://github.com/LMMs-Lab" className="link-underline interactive">
						GitHub
					</Link>
					<Link href="https://twitter.com/LMMsLab" className="link-underline interactive">
						Twitter
					</Link>
					<Link href="/rss.xml" className="link-underline interactive">
						RSS
					</Link>
				</nav>

				<p
					style={{
						opacity: 0.7,
						fontSize: "0.875rem",
					}}
				>
					{currentYear} LMMs-Lab. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
