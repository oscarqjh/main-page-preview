import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
}

export default function Badge({ variant = "default", style, children, ...props }: BadgeProps) {
	const baseStyle: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		padding: "var(--space-xs) var(--space-sm)",
		fontSize: "0.75rem",
		fontWeight: 500,
		lineHeight: 1,
		textTransform: "uppercase",
		letterSpacing: "0.05em",
		borderRadius: 0,
	};

	const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
		default: {
			backgroundColor: "var(--color-fg)",
			color: "var(--color-bg)",
		},
		outline: {
			backgroundColor: "transparent",
			color: "inherit",
			boxShadow: "0 0 0 1px currentColor",
		},
	};

	return (
		<span
			style={{
				...baseStyle,
				...variantStyles[variant],
				...style,
			}}
			{...props}
		>
			{children}
		</span>
	);
}
