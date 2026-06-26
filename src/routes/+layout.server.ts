import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, profile } = locals;

	if (!user) {
		return { auth: null };
	}

	return {
		auth: {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				emailVerified: user.emailVerified,
				image: user.image ?? null
			},
			profile: profile
				? {
						displayName: profile.displayName,
						avatarUrl: profile.avatarUrl ?? null
					}
				: null
		}
	};
};
