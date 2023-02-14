import type { PageServerLoad } from './$types';
import { containersManager, imagesManager } from '$lib/server/docker';

export const load = (async ({ depends }) => {
	depends('app:docker');
	const images = await imagesManager.getImagesData();
	const containers = await containersManager.getContainersData();
	return { images, containers };
}) satisfies PageServerLoad;
