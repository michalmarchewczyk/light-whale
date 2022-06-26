import type {RequestHandler} from '@sveltejs/kit';
import {githubController} from '$lib/server/sources/git/GithubController';
import { authGuard } from '$lib/server/auth/authGuard';

const get:RequestHandler = async ({request}) => {
	if(!authGuard(request.headers)){
		return {
			status: 401,
		};
	}
	const tokensInfo = await githubController.getTokensInfo();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(tokensInfo)
	};
};

export {
	get
};
