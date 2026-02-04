import { MDXRemoteWrapper } from "@/components/mdx/MDXRemoteWrapper";
import { getAllNotes, getNoteBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return { title: "Note Not Found" };

  return {
    title: `${note.title} - LMMs-Lab`,
    description: note.description,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="blog-content-wrapper flex justify-center">
      <div className="w-[95vw] sm:w-[70vw] max-w-[1600px]">
        <main className="w-full">
          <article className="w-full">
            <header className="blog-header">
              <time className="blog-date">
                {new Date(note.date)
                  .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  .toUpperCase()}
              </time>

              <h1 className="blog-title">{note.title}</h1>

              {note.description && (
                <p className="blog-description">{note.description}</p>
              )}

              {note.tags && note.tags.length > 0 && (
                <div className="blog-main-tags">
                  {note.tags.map((tag) => (
                    <span key={tag} className="blog-main-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="blog-prose">
              <MDXRemoteWrapper source={note.content} />
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
