import type {RequestHandler} from '@sveltejs/kit';
import {listRepos} from '$lib/server/sources/git/repos';

const get:RequestHandler = async () => {
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
