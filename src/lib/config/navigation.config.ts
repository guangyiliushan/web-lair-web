import type { Component } from 'svelte';
import {
	IconHome,
	IconBulb,
	IconCategory,
	IconUser,
	IconRss,
	IconMail,
	IconBrandGithub,
	IconBrandTwitter,
	IconHeart
} from '@tabler/icons-svelte-runes';

// ── 类型定义 ──

export interface NavChild {
	label: string;
	href: string;
	description?: string;
	icon?: Component;
	badge?: string;
}

export interface NavColumn {
	title?: string;
	items: NavChild[];
}

export interface NavFooter {
	label: string;
	href: string;
	secondary?: NavFooter;
}

export interface MegaMenu {
	columns: NavColumn[];
	footer?: NavFooter;
	/** 面板宽度 (Tailwind class) */
	width?: string;
}

export interface NavItem {
	key: string;
	label: string;
	href: string;
	icon?: Component;
	/** Desktop: mega menu hover 面板 */
	megaMenu?: MegaMenu;
	/** Mobile: accordion 子项 */
	children?: NavChild[];
}

// ── 单一数据�?──

export const navigationConfig: NavItem[] = [
	{
		key: 'nav_home',
		label: 'Home',
		href: '/',
		icon: IconHome,
		megaMenu: {
			width: 'w-[380px]',
			columns: [
				{
					title: 'Quick Links',
					items: [
						{
							label: 'RSS Feed',
							href: '/rss.xml',
							description: 'Subscribe to updates',
							icon: IconRss
						},
						{
							label: 'GitHub',
							href: 'https://github.com/guangyiliushan',
							description: 'Open source projects',
							icon: IconBrandGithub
						},
						{
							label: 'Twitter',
							href: 'https://twitter.com/guangyiliushan',
							description: 'Follow for updates',
							icon: IconBrandTwitter
						},
						{
							label: 'Email',
							href: 'mailto:guangyiliushan@example.com',
							description: 'Get in touch',
							icon: IconMail
						}
					]
				}
			]
		},
		children: [
			{ label: 'RSS Feed', href: '/rss.xml', icon: IconRss },
			{ label: 'GitHub', href: 'https://github.com/guangyiliushan', icon: IconBrandGithub },
			{ label: 'Twitter', href: 'https://twitter.com/guangyiliushan', icon: IconBrandTwitter },
			{ label: 'Email', href: 'mailto:guangyiliushan@example.com', icon: IconMail }
		]
	},
	{
		key: 'nav_thinking',
		label: 'Thoughts',
		href: '/thinking',
		icon: IconBulb,
		megaMenu: {
			width: 'w-[380px]',
			columns: [
				{
					title: 'Categories',
					items: [
						{ label: 'Tech', href: '/thinking?category=tech', badge: '12' },
						{ label: 'Life', href: '/thinking?category=life', badge: '8' },
						{ label: 'Design', href: '/thinking?category=design', badge: '5' },
						{ label: 'Reading', href: '/thinking?category=reading', badge: '3' }
					]
				}
			],
			footer: {
				label: 'View all thoughts',
				href: '/thinking',
				secondary: { label: 'Write a thought', href: '/thinking/new' }
			}
		},
		children: [
			{ label: 'All Thoughts', href: '/thinking' },
			{ label: 'Tech', href: '/thinking?category=tech', badge: '12' },
			{ label: 'Life', href: '/thinking?category=life', badge: '8' },
			{ label: 'Design', href: '/thinking?category=design', badge: '5' },
			{ label: 'Reading', href: '/thinking?category=reading', badge: '3' }
		]
	},
	{
		key: 'nav_categories',
		label: 'Categories',
		href: '/categories',
		icon: IconCategory,
		megaMenu: {
			width: 'w-[320px]',
			columns: [
				{
					items: [
						{ label: 'Tech', href: '/categories/tech', description: 'Programming & tools' },
						{ label: 'Life', href: '/categories/life', description: 'Daily thoughts' },
						{ label: 'Design', href: '/categories/design', description: 'UI & visual' },
						{ label: 'Reading', href: '/categories/reading', description: 'Books & articles' }
					]
				}
			],
			footer: { label: 'Browse all categories', href: '/categories' }
		},
		children: [
			{ label: 'All Categories', href: '/categories' },
			{ label: 'Tech', href: '/categories/tech' },
			{ label: 'Life', href: '/categories/life' },
			{ label: 'Design', href: '/categories/design' },
			{ label: 'Reading', href: '/categories/reading' }
		]
	},
	{
		key: 'nav_about',
		label: 'About',
		href: '/about',
		icon: IconUser,
		megaMenu: {
			width: 'w-[320px]',
			columns: [
				{
					items: [
						{
							label: 'About Me',
							href: '/about',
							description: 'Who I am',
							icon: IconUser
						},
						{
							label: 'About This Site',
							href: '/about-site',
							description: 'Tech stack & history',
							icon: IconHeart
						},
						{
							label: 'Archive',
							href: '/archive',
							description: 'All posts by date',
							icon: IconRss
						}
					]
				}
			]
		},
		children: [
			{ label: 'About Me', href: '/about' },
			{ label: 'About This Site', href: '/about-site' },
			{ label: 'Archive', href: '/archive' }
		]
	}
];
