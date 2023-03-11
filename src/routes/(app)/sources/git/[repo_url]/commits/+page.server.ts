import type { PageServerLoad } from '../$types';
import { reposManager } from '$lib/server/sources/git';
import { fail } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { repo_url } = params;
	const repo = await reposManager.getRepoByUrl(repo_url);
	if (!repo) {
		return fail(404, { error: 'repo not found' });
	}
	const commits = await reposManager.getRepoCommits(repo);
	return {
		commits
	};
}) satisfies PageServerLoad;
