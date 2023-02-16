import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { imagesManager } from '$lib/server/docker';

export const actions = {
	remove: async ({ params }) => {
		const image = await imagesManager.getImage(params.id);
		if (!image) {
			return fail(404, { message: 'Image not found' });
		}
		await image.remove();
	}
} satisfies Actions;
