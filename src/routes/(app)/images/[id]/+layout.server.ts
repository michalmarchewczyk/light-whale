import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { containersManager, imagesManager } from '$lib/server/docker';

export const load = (async ({ params, depends }) => {
	depends('app:docker');
	const image = await imagesManager.getImage(params.id);
	if (!image) {
		throw redirect(307, '/images');
	}
	const imageContainers = await containersManager.getContainersByImageId(image.id);
	return {
		image: image?.data,
		imageContainers: imageContainers.map((c) => c.data)
	};
}) satisfies LayoutServerLoad;
