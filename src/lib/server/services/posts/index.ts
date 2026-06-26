import type { PostListParams, CreatePostInput, UpdatePostInput, PostItem } from './types';

const posts: PostItem[] = [];

export async function listPosts(params: PostListParams): Promise<{ data: PostItem[]; total: number }> {
	// TODO: Query from DB with filters
	return { data: [], total: 0 };
}

export async function getPostById(id: string): Promise<PostItem | null> {
	// TODO: Query from DB
	return null;
}

export async function getPostBySlug(slug: string): Promise<PostItem | null> {
	// TODO: Query from DB
	return null;
}

export async function createPost(input: CreatePostInput, authorId: string): Promise<PostItem> {
	// TODO: Insert into DB
	throw new Error('Not implemented');
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<PostItem> {
	// TODO: Update in DB
	throw new Error('Not implemented');
}

export async function deletePost(id: string): Promise<void> {
	// TODO: Delete from DB
	throw new Error('Not implemented');
}

export async function publishPost(id: string): Promise<PostItem> {
	// TODO: Update status to published
	throw new Error('Not implemented');
}
