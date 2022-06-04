import type {RequestHandler} from '@sveltejs/kit';
import {buildRepo, fetchRepo} from '$lib/server/sources/git/repos';
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


const post:RequestHandler = async ({request, params}) => {
	// TODO: check if image/app name if available
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const repoUrl = params.repo_url;
	const {name, envVariables, selectedFile} = await request.json();
	const id = await buildRepo(repoUrl, name, selectedFile, envVariables);
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id}),
	};
};

export {
	get,
	post
};
