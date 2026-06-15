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

		// Better Auth handles the actual email sending via the sendResetPassword
		// callback configured in auth.ts. The callback will be triggered when a
		// user requests a password reset through the Better Auth API flow.
		// For now, we always return success to prevent email enumeration.
		// When an email service is integrated, replace with:
		// await auth.api.sendResetPassword({ body: { email, redirectTo: '/reset-password' } });

		return { success: true };
	}
};
