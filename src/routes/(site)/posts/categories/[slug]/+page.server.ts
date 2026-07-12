import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { posts, categories } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
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
	const cat = await db.query.categories.findFirst({
		where: eq(categories.slug, params.slug)
	});

	if (!cat) throw error(404, 'Category not found');

	// ── Fetch published posts in this category ──
	const postRows = await db.query.posts.findMany({
		where: and(eq(posts.categoryId, cat.id), eq(posts.isPublished, true)),
		orderBy: desc(posts.createdAt),
		columns: {
			id: true,
			title: true,
			slug: true,
			createdAt: true,
			tags: true
		}
	});

	// ── Assemble posts with tags ──
	const assembled: CategoryPostItem[] = postRows.map((p) => ({
		slug: p.slug,
		title: p.title,
		date: p.createdAt
			? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
			: '',
		tags: p.tags ?? []
	}));

	// ── Group by year ──
	const byYear = new Map<number, CategoryPostItem[]>();
	for (const p of assembled) {
		// Extract year from the post date (first 4 chars of date string, or current year as fallback)
		const year = p.date ? new Date(p.date).getFullYear() : new Date().getFullYear();
		if (!byYear.has(year)) byYear.set(year, []);
		byYear.get(year)!.push(p);
	}

	// Fallback: if no date parsed, use current year
	if (byYear.size === 0 && assembled.length > 0) {
		const year = new Date().getFullYear();
		byYear.set(year, assembled);
	}

	const sortedYears: YearGroup[] = [...byYear.entries()]
		.sort(([a], [b]) => b - a)
		.map(([year, yposts]) => ({ year, count: yposts.length, posts: yposts }));

	// ── Tag counts within this category ──
	const tagCounts = new Map<string, number>();
	for (const p of postRows) {
		for (const tag of p.tags ?? []) {
			tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
		}
	}

	const tags: CategoryTagCount[] = [...tagCounts.entries()]
		.map(([name, count]) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), count }))
		.sort((a, b) => b.count - a.count);

	// ── Earliest year for display ──
	const earliestYear =
		postRows.length > 0
			? postRows.reduce((earliest: number, p) => {
					const y = p.createdAt ? new Date(p.createdAt).getFullYear() : new Date().getFullYear();
					return y < earliest ? y : earliest;
				}, new Date().getFullYear())
			: new Date().getFullYear();

	return {
		category: { name: cat.name, slug: cat.slug },
		totalCount: postRows.length,
		earliestYear,
		years: sortedYears,
		tags
	};
};
