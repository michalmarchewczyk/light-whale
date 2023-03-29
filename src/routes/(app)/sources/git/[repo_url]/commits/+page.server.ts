import type { PageServerLoad } from '../$types';
import { reposManager } from '$lib/server/sources/git';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { repo_url } = params;
	const repo = await reposManager.getRepoByUrl(repo_url);
	if (!repo) {
		throw error(404, { message: 'repo not found' });
	}
	const commits = await reposManager.getRepoCommits(repo);
	return {
		commits
	};
}) satisfies PageServerLoad;
