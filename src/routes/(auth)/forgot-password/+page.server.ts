import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {};
};

export const actions: Actions = {
	sendReset: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';

		if (!email) {
			return fail(400, { message: 'Email is required' });
		}

		// TODO: Send password reset email via Better Auth
		// For now, always show success to avoid email enumeration
		return { success: true };
	}
};
