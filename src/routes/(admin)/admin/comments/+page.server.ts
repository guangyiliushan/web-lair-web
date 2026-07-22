import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const comments: CommentItem[] = [
		{
			id: '1',
			author: 'Alice',
			avatar: '',
			content: 'Great post!',
			targetTitle: 'Hello World',
			targetUrl: '/posts/hello-world',
			ip: '127.0.0.1',
			status: 'unread' as const,
			createdAt: new Date().toISOString()
		}
	];

	return {
		headerTitle: '评论',
		comments
	};
};

export interface CommentItem {
	id: string;
	author: string;
	avatar: string;
	content: string;
	targetTitle: string;
	targetUrl: string;
	ip: string;
	status: 'unread' | 'read' | 'awaiting' | 'whisper' | 'junk';
	createdAt: string;
}

export const load: PageServerLoad = async () => {
	const comments: CommentItem[] = [
		{
			id: '1',
			author: 'Alice',
			avatar: '',
			content: '这是一条测试评论，内容很有深度。',
			targetTitle: '如何搭建个人博客',
			targetUrl: '/posts/how-to-blog',
			ip: '127.0.0.1',
			status: 'unread',
			createdAt: '2026/07/17 11:30'
		},
		{
			id: '2',
			author: 'Bob',
			avatar: '',
			content: '写得不错，学习了！',
			targetTitle: 'Svelte 5 入门指南',
			targetUrl: '/posts/svelte5-guide',
			ip: '192.168.1.1',
			status: 'read',
			createdAt: '2026/07/16 09:15'
		},
		{
			id: '3',
			author: 'Charlie',
			avatar: '',
			content: '请问能详细讲一下这部分吗？',
			targetTitle: '如何搭建个人博客',
			targetUrl: '/posts/how-to-blog',
			ip: '10.0.0.1',
			status: 'awaiting',
			createdAt: '2026/07/16 14:20'
		}
	];

	const tabs = [
		{ id: 'all', label: '全部' },
		{ id: 'unread', label: '未读' },
		{ id: 'awaiting', label: '待回复' },
		{ id: 'whisper', label: '悄悄话' },
		{ id: 'read', label: '已读' },
		{ id: 'junk', label: '垃圾' }
	] as const;

	return {
		comments,
		tabs,
		counts: {
			all: 3,
			unread: 1,
			awaiting: 1,
			whisper: 0,
			read: 1,
			junk: 0
		}
	};
};
