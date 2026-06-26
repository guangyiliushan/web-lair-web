export interface PostItem {
	id: string;
	title: string;
	slug: string;
	summary: string | null;
	content: string;
	status: 'draft' | 'published' | 'archived';
	coverUrl: string | null;
	authorId: string;
	categoryId: string | null;
	isPinned: boolean;
	publishedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreatePostInput {
	title: string;
	slug: string;
	summary?: string;
	content: string;
	status?: 'draft' | 'published';
	coverUrl?: string;
	categoryId?: string;
	tagIds?: string[];
}

export interface UpdatePostInput {
	title?: string;
	slug?: string;
	summary?: string;
	content?: string;
	status?: 'draft' | 'published' | 'archived';
	coverUrl?: string;
	categoryId?: string;
	tagIds?: string[];
}

export interface PostListParams {
	status?: string;
	category?: string;
	tag?: string;
	keyword?: string;
	page?: number;
	limit?: number;
}
