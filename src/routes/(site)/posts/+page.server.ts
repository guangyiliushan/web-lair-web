import type { PageServerLoad } from './$types';

export interface PostItem {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	category: string;
	tags: string[];
	views: number;
	likes: number;
	isPinned?: boolean;
	translated?: { from: string; to: string };
}

export interface TagCount {
	name: string;
	count: number;
}

export const load: PageServerLoad = async () => {
	const posts: PostItem[] = [
		{
			slug: 'ai-era-efficiency-paradox',
			title:
				'The Efficiency Paradox of the AI Era: When Increased Productivity Brings Fatigue Instead',
			excerpt:
				'Yesterday I saw an article about whether AI makes us feel fatigued. The more powerful our tools become, the more we seem to struggle with burnout.',
			date: 'March 1, 2026',
			category: 'Experience',
			tags: ['ai', 'productivity'],
			views: 2511,
			likes: 20,
			isPinned: true,
			translated: { from: '中文', to: 'English' }
		},
		{
			slug: 'decouple-hydration-from-react-ui',
			title: 'Decoupling Hydration from the React UI: A Boundary Correction During SPA Startup',
			excerpt:
				'Cold-starting a React SPA often produces a specific visual glitch: business content flashes before hydration completes.',
			date: '9 days ago',
			category: 'Technology',
			tags: ['React', 'SWR', 'Electron'],
			views: 648,
			likes: 11,
			translated: { from: '中文', to: 'English' }
		},
		{
			slug: 'nextjs-shell-hono-backend-migration',
			title: "Hollowing Out Next.js: A Field Report on Migrating LobeHub's Backend to Hono",
			excerpt:
				'The task I was given sounded simple: fully extract Hono. The underlying challenge was decoupling a tightly-integrated Next.js application.',
			date: '16 days ago',
			category: 'Technology',
			tags: ['Next.js', 'Hono'],
			views: 794,
			likes: 3,
			translated: { from: '中文', to: 'English' }
		},
		{
			slug: 'skill-first-blog-second',
			title: 'Turning AI Sessions into Two Assets',
			excerpt:
				'When collaborating with AI on engineering tasks, you often hit a certain type of repetitive friction. What if each session produced reusable outputs?',
			date: 'May 25, 2026',
			category: 'Technology',
			tags: ['ai', 'workflow', 'mxs'],
			views: 1473,
			likes: 5,
			translated: { from: '中文', to: 'English' }
		},
		{
			slug: 'lobehub-vite-route-module-prewarm',
			title: "LobeHub's Vite Route Module Warmup Practice",
			excerpt:
				'In large SPAs, code splitting is essential, but it introduces another problem: a cold start penalty when navigating to new routes.',
			date: 'May 23, 2026',
			category: 'Technology',
			tags: ['vite', 'performance'],
			views: 572,
			likes: 6,
			translated: { from: '中文', to: 'English' }
		}
	];

	const pinnedPost = posts.find((p) => p.isPinned) ?? null;
	const normalPosts = posts.filter((p) => !p.isPinned);
	const totalCount = posts.length;

	const tags: TagCount[] = [
		{ name: 'react', count: 48 },
		{ name: 'typescript', count: 45 },
		{ name: 'nextjs', count: 30 },
		{ name: 'javascript', count: 28 },
		{ name: 'css', count: 22 },
		{ name: 'vue', count: 18 },
		{ name: 'ai', count: 13 },
		{ name: 'ssr', count: 11 },
		{ name: 'refactor', count: 10 },
		{ name: 'vercel', count: 10 }
	];

	return {
		pinnedPost,
		posts: normalPosts,
		totalCount,
		tags
	};
};
