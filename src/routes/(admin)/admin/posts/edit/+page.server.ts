import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, posts } from '$lib/server/db/content';
import { getSnowflake } from '$lib/server/snowflake';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allCategories = await db
		.select({ id: categories.id, name: categories.name, slug: categories.slug })
		.from(categories)
		.orderBy(categories.name);

	return {
		categories: allCategories,
		aiAvailable: false
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim().toLowerCase();
		const categoryId = formData.get('categoryId')?.toString();
		const summary = formData.get('summary')?.toString().trim();
		const content = formData.get('content')?.toString();
		const tagsRaw = formData.get('tags')?.toString();
		const isPublished = formData.get('isPublished') === 'true';

		const errors: Record<string, string> = {};
		const values = { title, slug, summary, categoryId, content, tags: tagsRaw, isPublished };

		if (!title) errors.title = 'Title is required';
		if (!slug) {
			errors.slug = 'Slug is required';
		} else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
			errors.slug = 'Slug must be lowercase alphanumeric with hyphens';
		}
		if (!categoryId) errors.categoryId = 'Category is required';
		if (!content?.trim()) errors.content = 'Content is required';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		// Check slug uniqueness
		const existing = await db.query.posts.findFirst({ where: eq(posts.slug, slug!) });
		if (existing) {
			errors.slug = 'This slug is already in use';
			return fail(400, { errors, values });
		}

		const now = new Date();
		const id = getSnowflake().nextId();
		const tags = tagsRaw
			? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
			: [];

		await db.insert(posts).values({
			id,
			title: title!,
			slug: slug!,
			categoryId: categoryId!,
			content: content!,
			contentFormat: 'markdown',
			summary: summary ?? null,
			tags,
			isPublished: isPublished ?? true,
			createdAt: now,
			modifiedAt: now
		});

		throw redirect(303, `/admin/posts/${id}/edit`);
	}
} satisfies Actions;
