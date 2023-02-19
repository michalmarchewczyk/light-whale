import type { RequestHandler } from '@sveltejs/kit';
import { sessionManager } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import validator from 'validator';
import { repoFilesReader, reposManager } from '$lib/server/sources/git';

export const GET = (async ({ cookies, params, url }) => {
	const sessionId = cookies.get('sessionId');
	if (!sessionId || !sessionManager.checkSession(sessionId)) {
		throw error(401, 'Unauthorized');
	}
	if (!params.repo_url) {
		throw error(400, 'Bad request');
	}
	const repo = await reposManager.getRepoByUrl(params.repo_url);
	if (!repo) {
		throw error(404, 'Not found');
	}
	const path = url.searchParams.get('path') ?? '';
	if (
		!validator.isURL(path, {
			require_valid_protocol: false,
			require_host: false
		})
	) {
		throw error(400, 'Bad request');
	}
	const data = await repoFilesReader.readPath(repo, path);
	if (typeof data === 'string') {
		return new Response(JSON.stringify({ type: 'file', data }));
	} else {
		return new Response(JSON.stringify({ type: 'folder', data }));
	}
}) satisfies RequestHandler;
