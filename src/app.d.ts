import type { User, Session } from 'better-auth';

declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
			profile?: {
				displayName: string;
				slug: string;
				bio: string | null;
				avatarUrl: string | null;
				status: 'active' | 'suspended' | 'deleted';
			};
			admin?: {
				userId: string;
				sessionId: string;
				issuedAt: number;
				expiresAt: number;
			} | null;
		}
		interface PageData {
			auth?: {
				user: {
					id: string;
					name: string;
					email: string;
					emailVerified: boolean;
					image: string | null;
				} | null;
				profile: {
					displayName: string;
					avatarUrl: string | null;
				} | null;
			} | null;
			/** admin-header 自动读取此字段作为页面标题 */
			headerTitle?: string;
			/** admin-header 自动读取此字段作为操作按钮 */
			headerActions?: Array<{
				label: string;
				iconName: string;
				variant?: 'default' | 'outline' | 'ghost';
				size?: 'default' | 'sm' | 'lg' | 'icon';
				href?: string;
			}>;
		}
	}
}

export {};
