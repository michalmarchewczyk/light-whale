import type {RequestHandler} from '@sveltejs/kit';
import {fetchRepo} from '$lib/server/sources/git/repos';
import {checkSession} from '$lib/server/auth/sessions';

const get:RequestHandler = async ({request, params}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const repoUrl = params.repo_url;
	const repoInfo = await fetchRepo(repoUrl);
	if(!repoInfo){
		return {
			status: 500
		};
	}
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(repoInfo),
	};
};

export {
	get
};
