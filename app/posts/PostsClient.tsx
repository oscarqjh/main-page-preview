"use client";

import ArchiveList from "@/components/ArchiveList";

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

export function PostsClient({ posts }: PostsClientProps) {
	return (
		<ArchiveList
			entries={posts}
			basePath="/posts"
			label="Archive"
			sysPath="SYS://research/publications - index"
		/>
	);
}
