import type { Actions } from './$types';

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		console.log("create action in add Webbing");
		console.log(data);

		return { success: true };
	}
} satisfies Actions;

