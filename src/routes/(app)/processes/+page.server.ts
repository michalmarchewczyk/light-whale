import type { PageServerLoad } from './$types';
import { processesManager } from '$lib/server/processes';

export const load = (({ depends }) => {
	depends('app:docker');
	const processes = processesManager.getProcesses();
	return {
		processes
	};
}) satisfies PageServerLoad;
