import type { Actions, PageServerLoad } from './$types';
import { gitServicesController, reposManager } from '$lib/server/sources/git';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const remoteRepos = await gitServicesController.listAllRepos();
	const localRepos = await reposManager.listRepos();
	return {
		remoteRepos,
		localRepos
	};
}) satisfies PageServerLoad;

export const actions = {
	pull: async ({ request }) => {
		const data = await request.formData();
		const remoteUrl = data.get('remoteUrl');
		if (!remoteUrl || typeof remoteUrl !== 'string') {
			return fail(400, { error: 'Invalid remoteUrl' });
		}
		const repo = await gitServicesController.getRepoByRemoteUrl(remoteUrl);
		const downloaded = await reposManager.downloadRepo(
			remoteUrl,
			repo?.branchName,
			repo?.tokenId,
			repo?.service
		);
		if (!downloaded) {
			return fail(400, { error: 'Failed to download repo' });
		}
	}
} satisfies Actions;
