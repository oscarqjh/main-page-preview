"use client";

import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
	href?: string;
	children: ReactNode;
}

export default function Card({ href, style, children, ...props }: CardProps) {
	const cardStyle: React.CSSProperties = {
		display: "block",
		padding: "var(--space-lg)",
		boxShadow: "0 0 0 2px currentColor",
		textDecoration: "none",
		color: "inherit",
		...style,
	};

	if (href) {
		return (
			<Link href={href} style={cardStyle} className="card-lift" {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
				{children}
			</Link>
		);
	}

	return (
		<article style={cardStyle} {...props}>
			{children}
		</article>
	);
}
