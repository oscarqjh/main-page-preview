import Badge from "@/components/Badge";
import Card from "@/components/Card";
import { getAllNotes } from "@/lib/posts";

export const metadata = {
	title: "Notes - LMMs-Lab",
	description: "Quick notes and thoughts from LMMs-Lab",
};

export default function NotesPage() {
	const notes = getAllNotes();

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
					Notes
				</h1>
				<p style={{ opacity: 0.8 }}>Quick thoughts, observations, and smaller updates.</p>
			</header>

			<div style={{ display: "grid", gap: "var(--space-md)" }}>
				{notes.length === 0 ? (
					<p style={{ opacity: 0.7 }}>No notes yet. Check back soon!</p>
				) : (
					notes.map((note) => (
						<Card key={note.slug} href={`/notes/${note.slug}`}>
							{note.tags && note.tags.length > 0 && (
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "var(--space-sm)",
										marginBottom: "var(--space-sm)",
									}}
								>
									{note.tags.map((tag) => (
										<Badge key={tag} variant="outline">
											{tag}
										</Badge>
									))}
								</div>
							)}
							<h2
								style={{
									fontSize: "1.25rem",
									fontWeight: 600,
									marginBottom: "var(--space-sm)",
								}}
							>
								{note.title}
							</h2>
							<time style={{ fontSize: "0.875rem", opacity: 0.6 }}>
								{new Date(note.date).toLocaleDateString("en-US", {
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
