"use client";

import { useState } from "react";
import Badge from "@/components/Badge";
import Card from "@/components/Card";

interface Post {
	slug: string;
	title: string;
	description?: string;
	date: string;
	tags?: string[];
}

interface PostsClientProps {
	posts: Post[];
}

const POSTS_PER_PAGE = 10;

export function PostsClient({ posts }: PostsClientProps) {
	const [currentPage, setCurrentPage] = useState(1);
	
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
	const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
	const endIndex = startIndex + POSTS_PER_PAGE;
	const currentPosts = posts.slice(startIndex, endIndex);

	const goToPage = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div
			className="container"
			style={{
				paddingTop: "var(--space-xl)",
				paddingBottom: "var(--space-xl)",
			}}
		>
			<header style={{ marginBottom: "var(--space-xl)" }}>
				<h1
					style={{
						fontSize: "2.5rem",
						fontWeight: 700,
						marginBottom: "var(--space-sm)",
					}}
				>
					Posts
				</h1>
				<p style={{ opacity: 0.8 }}>
					Research updates, technical deep-dives, and announcements.
					{posts.length > 0 && (
						<span style={{ marginLeft: "0.5rem", fontSize: "var(--text-caption)" }}>
							({posts.length} total)
						</span>
					)}
				</p>
			</header>

			<div style={{ display: "grid", gap: "var(--space-md)" }}>
				{currentPosts.length === 0 ? (
					<p style={{ opacity: 0.7 }}>No posts yet. Check back soon!</p>
				) : (
					currentPosts.map((post) => (
						<Card 
							key={post.slug} 
							href={`/posts/${post.slug}`}
							aria-label={`Read article: ${post.title}`}
						>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: "var(--space-sm)",
									marginBottom: "var(--space-sm)",
								}}
							>
								{post.tags?.map((tag) => (
									<Badge key={tag} variant="outline">
										{tag}
									</Badge>
								))}
							</div>
							<h2
								style={{
									fontSize: "1.5rem",
									fontWeight: 600,
									marginBottom: "var(--space-sm)",
								}}
							>
								{post.title}
							</h2>
							{post.description && (
								<p
									style={{
										opacity: 0.8,
										marginBottom: "var(--space-sm)",
										maxWidth: "65ch",
									}}
								>
									{post.description}
								</p>
							)}
							<time style={{ fontSize: "var(--text-caption)", opacity: 0.6 }}>
								{new Date(post.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
						</Card>
					))
				)}
			</div>

			{totalPages > 1 && (
				<nav 
					aria-label="Posts pagination" 
					style={{ 
						marginTop: "var(--space-xl)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "var(--space-sm)",
					}}
				>
					<button
						onClick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
						aria-label="Previous page"
						style={{
							padding: "var(--space-sm) var(--space-md)",
							background: "transparent",
							border: "2px solid currentColor",
							color: "inherit",
							cursor: currentPage === 1 ? "not-allowed" : "pointer",
							opacity: currentPage === 1 ? 0.4 : 1,
							fontSize: "var(--text-caption)",
							fontWeight: 600,
							transition: "opacity var(--duration-fast) var(--ease-out)",
						}}
					>
						Prev
					</button>

					<div style={{ 
						display: "flex", 
						gap: "var(--space-xs)",
						alignItems: "center",
					}}>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => goToPage(page)}
								aria-label={`Page ${page}`}
								aria-current={currentPage === page ? "page" : undefined}
								style={{
									width: "2.5rem",
									height: "2.5rem",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									background: currentPage === page ? "var(--foreground)" : "transparent",
									color: currentPage === page ? "var(--background)" : "inherit",
									border: currentPage === page ? "none" : "1px solid currentColor",
									cursor: "pointer",
									fontSize: "var(--text-caption)",
									fontWeight: 600,
									transition: "all var(--duration-fast) var(--ease-out)",
								}}
							>
								{page}
							</button>
						))}
					</div>

					<button
						onClick={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						aria-label="Next page"
						style={{
							padding: "var(--space-sm) var(--space-md)",
							background: "transparent",
							border: "2px solid currentColor",
							color: "inherit",
							cursor: currentPage === totalPages ? "not-allowed" : "pointer",
							opacity: currentPage === totalPages ? 0.4 : 1,
							fontSize: "var(--text-caption)",
							fontWeight: 600,
							transition: "opacity var(--duration-fast) var(--ease-out)",
						}}
					>
						Next
					</button>
				</nav>
			)}
		</div>
	);
}
