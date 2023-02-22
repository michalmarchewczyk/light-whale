import type { Actions, PageServerLoad } from './$types';
import { containersManager, imagesManager } from '$lib/server/docker';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ depends }) => {
	depends('app:docker');
	const images = await imagesManager.getImagesData();
	const containers = await containersManager.getContainersData();
	return { images, containers };
}) satisfies PageServerLoad;

export const actions = {
	pull: async ({ request }) => {
		const data = await request.formData();
		const image = data.get('image');
		const tag = data.get('tag');
		if (!image || !tag || typeof image !== 'string' || typeof tag !== 'string') {
			return { error: 'Invalid image or tag' };
		}
		await imagesManager.pullImage(image, tag);
		throw redirect(307, '/processes');
	}
} satisfies Actions;
