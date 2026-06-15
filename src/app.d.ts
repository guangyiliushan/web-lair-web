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
	}
}

export {};
