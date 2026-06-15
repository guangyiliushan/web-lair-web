import type { User, Session } from 'better-auth/minimal';

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
