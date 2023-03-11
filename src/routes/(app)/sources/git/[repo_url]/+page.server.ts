import type { Actions, PageServerLoad } from './$types';
import { repoBuilder, reposManager } from '$lib/server/sources/git';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { repo_url } = params;
	const repo = await reposManager.getRepoByUrl(repo_url);
	if (!repo) {
		return { newCommits: [] };
	}
	return {
		info: {
			repo,
			newCommits: reposManager.checkNewCommits(repo)
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	pull: async ({ params }) => {
		const { repo_url } = params;
		const repo = await reposManager.getRepoByUrl(repo_url);
		if (!repo) {
			return fail(404, { error: 'repo not found' });
		}
		await reposManager.pullRepo(repo);
	},
	build: async ({ request, params }) => {
		const { repo_url } = params;
		const data = await request.formData();
		const name = data.get('name');
		const selectedFile = data.get('file');
		if (!name || !selectedFile || typeof name !== 'string' || typeof selectedFile !== 'string') {
			return fail(400, { error: 'invalid data' });
		}
		const envVariables = [...data.entries()]
			.filter(([key]) => key.startsWith('envVars_'))
			.reduce((acc: Record<string, string>, [key, value]) => {
				acc[key.replace('envVars_', '')] = <string>value;
				return acc;
			}, {});
		const repo = await reposManager.getRepoByUrl(repo_url);
		if (!repo) {
			return fail(404, { error: 'repo not found' });
		}
		const built = await repoBuilder.buildRepo(repo, name, selectedFile, envVariables);
		if (!built) {
			return fail(500, { error: 'error building image' });
		}
		throw redirect(307, '/processes');
	}
} satisfies Actions;
