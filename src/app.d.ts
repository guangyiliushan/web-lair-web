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
		}
	}
}

export {};
