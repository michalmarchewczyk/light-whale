import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/server/auth/sessions';
import {getGithubTokensInfo} from '$lib/server/auth/github';
import {getAllTokens} from '$lib/server/auth/tokens';

const get:RequestHandler = async ({request}) => {
	if(!checkSession(request.headers)){
		return {
			status: 401,
		};
	}
	const tokens = getAllTokens();
	const tokensInfo = await getGithubTokensInfo(tokens);
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(tokensInfo)
	};
};

export {
	get
};
