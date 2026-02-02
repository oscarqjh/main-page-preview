import Badge from "@/components/Badge";
import Card from "@/components/Card";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
	title: "Posts - LMMs-Lab",
	description: "Blog posts from LMMs-Lab research team",
};

export default function PostsPage() {
	const posts = getAllPosts();

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
				<p style={{ opacity: 0.8 }}>Research updates, technical deep-dives, and announcements.</p>
			</header>

			<div style={{ display: "grid", gap: "var(--space-md)" }}>
				{posts.length === 0 ? (
					<p style={{ opacity: 0.7 }}>No posts yet. Check back soon!</p>
				) : (
					posts.map((post) => (
						<Card key={post.slug} href={`/posts/${post.slug}`}>
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
							<time style={{ fontSize: "0.875rem", opacity: 0.6 }}>
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
		</div>
	);
}
