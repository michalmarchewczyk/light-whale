import type { PageServerLoad } from './$types';
import { logger } from '$lib/server/utils/Logger';

export const load = (() => {
	const logs = logger.getLogs();
	return {
		logs
	};
}) satisfies PageServerLoad;
