"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

interface TableOfContentsProps {
	headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{
				rootMargin: "-80px 0px -80% 0px",
				threshold: 0,
			}
		);

		headings.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, [headings]);

	if (headings.length === 0) return null;

	return (
		<nav className="toc" aria-label="Table of contents">
			<div className="toc-title">On this page</div>
			<ul className="toc-list">
				{headings.map((heading) => (
					<li
						key={heading.id}
						className={`toc-item toc-level-${heading.level}`}
						data-active={activeId === heading.id}
					>
						<a href={`#${heading.id}`} className="toc-link">
							{heading.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
