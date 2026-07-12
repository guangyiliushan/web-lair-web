import type {
	MegaMenuDynamicData,
	NavChild,
	TimelineActivityItem
} from '$lib/config/navigation.config';

/**
 * Load data for the Posts mega menu.
 * Replace the placeholder data with real DB queries when posts/categories tables exist.
 */
export async function loadPostsMegaData(): Promise<MegaMenuDynamicData> {
	// TODO: Replace with actual database queries

	const leftItems: NavChild[] = [
		{ labelKey: 'nav_categories_tech', href: '/categories/tech', badge: 12 },
		{ labelKey: 'nav_categories_life', href: '/categories/life', badge: 8 },
		{ labelKey: 'nav_categories_design', href: '/categories/design', badge: 5 },
		{ labelKey: 'nav_categories_reading', href: '/categories/reading', badge: 3 }
	];

	const rightItems: NavChild[] = [
		{ label: 'Getting Started with SvelteKit', href: '/posts/1', desc: 'Thursday, May 14, 2026' },
		{ label: 'Building a Blog with Drizzle ORM', href: '/posts/2', desc: 'Tuesday, May 12, 2026' },
		{
			label: 'Design System with Tailwind CSS v4',
			href: '/posts/3',
			desc: 'Saturday, June 14, 2025'
		},
		{
			label: 'Deploying to Vercel with GitHub Actions',
			href: '/posts/4',
			desc: 'Wednesday, May 1, 2024'
		}
	];

	return { leftItems, rightItems, footerSecondaryText: '28 posts' };
}

/**
 * Load data for the Notes mega menu.
 * Replace the placeholder data with real DB queries when notes/series tables exist.
 */
export async function loadNotesMegaData(): Promise<MegaMenuDynamicData> {
	// TODO: Replace with actual database queries

	const leftItems: NavChild[] = [
		{
			label: 'Year End Review',
			href: '/notes/series/year-summary',
			imageUrl: 'https://placehold.co/32x32/6366f1/white?text=Y'
		},
		{
			label: 'Memories — Shanghai',
			href: '/notes/series/shanghai',
			imageUrl: 'https://placehold.co/32x32/f59e0b/white?text=S'
		},
		{
			label: 'Late Night Emo',
			href: '/notes/series/emo',
			imageUrl: 'https://placehold.co/32x32/8b5cf6/white?text=E'
		},
		{
			label: 'Phase Summary',
			href: '/notes/series/stage-summary',
			imageUrl: 'https://placehold.co/32x32/10b981/white?text=P'
		},
		{
			label: 'Morning Flowers, Evening Picks',
			href: '/notes/series/morning-glory',
			imageUrl: 'https://placehold.co/32x32/ec4899/white?text=M'
		},
		{
			label: 'Current Update',
			href: '/notes/series/recent',
			imageUrl: 'https://placehold.co/32x32/06b6d4/white?text=C'
		},
		{
			label: 'Travel Notes',
			href: '/notes/series/tour',
			imageUrl: 'https://placehold.co/32x32/f97316/white?text=T'
		}
	];

	const rightItems: NavChild[] = [
		{
			label: 'First Time in Tokyo: A Trip 26 Years in the Making',
			href: '/notes/1',
			desc: '11 days ago'
		},
		{
			label: 'When Life Is Consumed by AI, I Start Reflecting on Loneliness and Love',
			href: '/notes/2',
			desc: 'Tuesday, May 26, 2026'
		},
		{
			label: 'Code & Dopamine: My Month of AI-Powered Creation',
			href: '/notes/3',
			desc: 'Wednesday, May 6, 2026'
		},
		{ label: 'A Child Who Never Grew Up', href: '/notes/4', desc: 'Monday, April 20, 2026' }
	];

	return { leftItems, rightItems };
}

/**
 * Load data for the Timeline mega menu.
 * Replace the placeholder data with real DB queries when posts/notes tables exist.
 */
export async function loadTimelineMegaData(): Promise<MegaMenuDynamicData> {
	// TODO: Replace with actual database queries
	// Combine recent posts and notes sorted by date

	const activities: TimelineActivityItem[] = [
		{
			title: 'Decoupling Hydration from the React UI: A Boundary Correction During SPA Startup',
			href: '/posts/tech/hydration',
			type: 'posts',
			date: '8 days ago'
		},
		{
			title: 'First Time in Tokyo: A Trip 26 Years in the Making',
			href: '/notes/1',
			type: 'notes',
			date: '11 days ago'
		},
		{
			title: "Hollowing Out Next.js: A Field Report on Migrating LobeHub's Backend to Hono",
			href: '/posts/tech/nextjs-hono',
			type: 'posts',
			date: '14 days ago'
		},
		{
			title: 'When Life Is Consumed by AI, I Start Reflecting on Loneliness and Love',
			href: '/notes/2',
			type: 'notes',
			date: 'Tuesday, May 26, 2026'
		}
	];

	return { leftItems: [], rightItems: [], timelineItems: activities };
}
