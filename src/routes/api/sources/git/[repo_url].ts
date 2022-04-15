import type {RequestHandler} from '@sveltejs/kit';
import {fetchRepo} from '$lib/server/sources/git/repos';

const get:RequestHandler = async ({params}) => {
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
