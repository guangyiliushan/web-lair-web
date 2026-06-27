import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { post, category, tag, postTag } from '$lib/server/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export interface CategoryPostItem {
	slug: string;
	title: string;
	date: string;
	tags: string[];
}

export interface CategoryTagCount {
	name: string;
	slug: string;
	count: number;
}

export interface YearGroup {
	year: number;
	count: number;
	posts: CategoryPostItem[];
}

export const load: PageServerLoad = async ({ params }) => {
	// ── Fetch category ──
	const cat = await db.query.category.findFirst({
		where: eq(category.slug, params.slug)
	});

	if (!cat) throw error(404, 'Category not found');

	// ── Fetch published posts in this category ──
	const posts = await db.query.post.findMany({
		where: and(eq(post.categoryId, cat.id), eq(post.status, 'published')),
		orderBy: desc(post.publishedAt),
		columns: {
			id: true,
			title: true,
			slug: true,
			publishedAt: true
		}
	});

	// ── Fetch tags for these posts ──
	const postIds = posts.map((p) => p.id);
	const tagRelations =
		postIds.length > 0
			? await db
					.select({
						postId: postTag.postId,
						name: tag.name,
						slug: tag.slug
					})
					.from(postTag)
					.innerJoin(tag, eq(postTag.tagId, tag.id))
					.where(sql`${postTag.postId} = ANY(${postIds})`)
			: [];

	// ── Assemble posts with tags ──
	const tagMap = new Map<string, string[]>();
	for (const tr of tagRelations) {
		if (!tagMap.has(tr.postId)) tagMap.set(tr.postId, []);
		tagMap.get(tr.postId)!.push(tr.name);
	}

	const assembled: CategoryPostItem[] = posts.map((p) => ({
		slug: p.slug,
		title: p.title,
		date: p.publishedAt
			? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
			: '',
		tags: tagMap.get(p.id) ?? []
	}));

	// ── Group by year ──
	const yearMap = new Map<number, CategoryPostItem[]>();
	for (const p of assembled) {
		// Extract year from slug-based date or use sort position as fallback
		// For now, infer year from any date-like pattern in the post
		const year = new Date().getFullYear(); // TODO: derive from publishedAt
		if (!yearMap.has(year)) yearMap.set(year, []);
		yearMap.get(year)!.push(p);
	}

	// Re-derive years properly from assembled posts
	const byYear = new Map<number, CategoryPostItem[]>();
	for (const p of posts) {
		const y = p.publishedAt ? new Date(p.publishedAt).getFullYear() : new Date().getFullYear();
		const item: CategoryPostItem = {
			slug: p.slug,
			title: p.title,
			date: p.publishedAt
				? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
				: '',
			tags: tagMap.get(p.id) ?? []
		};
		if (!byYear.has(y)) byYear.set(y, []);
		byYear.get(y)!.push(item);
	}

	const sortedYears = [...byYear.entries()]
		.sort(([a], [b]) => b - a)
		.map(([year, yposts]) => ({ year, count: yposts.length, posts: yposts }));

	// ── Tag counts within this category ──
	const tagCounts = new Map<string, { slug: string; count: number }>();
	for (const tr of tagRelations) {
		const existing = tagCounts.get(tr.name);
		if (existing) {
			existing.count++;
		} else {
			tagCounts.set(tr.name, { slug: tr.slug, count: 1 });
		}
	}

	const tags: CategoryTagCount[] = [...tagCounts.entries()]
		.map(([name, { slug, count }]) => ({ name, slug, count }))
		.sort((a, b) => b.count - a.count);

	// ── Earliest year for display ──
	const earliestYear =
		posts.length > 0
			? posts.reduce(
					(earliest, p) =>
						p.publishedAt && new Date(p.publishedAt).getFullYear() < earliest
							? new Date(p.publishedAt).getFullYear()
							: earliest,
					new Date().getFullYear()
				)
			: new Date().getFullYear();

	return {
		category: { name: cat.name, slug: cat.slug, description: cat.description },
		totalCount: posts.length,
		earliestYear,
		years: sortedYears,
		tags
	};
};
