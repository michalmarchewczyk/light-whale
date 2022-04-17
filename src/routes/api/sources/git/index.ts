import type {RequestHandler} from '@sveltejs/kit';
import {listRepos} from '$lib/server/sources/git/repos';
import {checkSession} from '$lib/server/auth/sessions';

const get:RequestHandler = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const repos = await listRepos();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(repos),
	};
};

export {
	get
};
