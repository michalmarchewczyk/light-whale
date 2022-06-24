import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/server/auth/sessions';
import {listGithubRepos} from '$lib/server/sources/git/github';

const get:RequestHandler = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const repos = await listGithubRepos();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(repos),
	};
};

export {
	get
};
