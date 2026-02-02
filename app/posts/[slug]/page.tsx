import { MDXRemoteWrapper } from "@/components/mdx/MDXRemoteWrapper";
import { TableOfContents, ReadingProgress } from "@/components/blog";
import { extractHeadings } from "@/lib/toc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	const posts = getAllPosts();
	return posts.map((post) => ({
		slug: post.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPostBySlug(slug);
	if (!post) return { title: "Post Not Found" };

	return {
		title: `${post.title} - LMMs-Lab`,
		description: post.description,
	};
}

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const headings = extractHeadings(post.content);

	return (
		<>
			<ReadingProgress />
			<div className="blog-content-wrapper">
				<div className="blog-layout">
					<aside className="blog-sidebar">
						<TableOfContents headings={headings} />
					</aside>

					<main className="blog-main">
						<article className="blog-article">
							<header className="blog-header">
								<time className="blog-date">
									{new Date(post.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									}).toUpperCase()}
								</time>

								<h1 className="blog-title">{post.title}</h1>

								{post.description && (
									<p className="blog-description">{post.description}</p>
								)}

								{post.authors && post.authors.length > 0 && (
									<div className="blog-authors">
										{post.authors.map((author, i) => (
											<span key={author.name} className="blog-author">
												{author.url ? (
													<a href={author.url} target="_blank" rel="noopener noreferrer">
														{author.name}
													</a>
												) : (
													author.name
												)}
												{author.main && <span className="author-main">*</span>}
												{i < post.authors!.length - 1 && ", "}
											</span>
										))}
									</div>
								)}

								{post.mainTags && post.mainTags.length > 0 && (
									<div className="blog-main-tags">
										{post.mainTags.map((tag) => (
											<span key={tag} className="blog-main-tag">{tag}</span>
										))}
									</div>
								)}
							</header>

							<div className="blog-prose">
								<MDXRemoteWrapper source={post.content} />
							</div>
						</article>
					</main>
				</div>
			</div>
		</>
	);
}
