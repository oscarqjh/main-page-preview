import { getAllNotes } from "@/lib/posts";
import { NotesClient } from "./NotesClient";

export const metadata = {
	title: "Notes - LMMs-Lab",
	description: "Quick notes and thoughts from LMMs-Lab",
};

export default function NotesPage() {
	const notes = getAllNotes();
	return <NotesClient notes={notes} />;
}
