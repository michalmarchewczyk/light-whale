import type {RequestHandler} from '@sveltejs/kit';
import {authGuard} from '$lib/server/auth/authGuard';
import {reposController} from '$lib/server/sources/git/ReposController';
import validator from 'validator';

const get:RequestHandler = async ({request, params}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const repoUrl = params.repo_url;
	const repoInfo = await reposController.fetchRepo(repoUrl);
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
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const repoUrl = params.repo_url;
	const {name, envVariables, selectedFile} = await request.json();
	if(!validator.isAlphanumeric(name, 'en-US', {ignore: '-'}) || !validator.isURL(selectedFile, {
		require_tld: false,
		require_valid_protocol: false,
		require_host: false,
	})) {
		return {
			status: 400,
			headers: {'Content-Type': 'application/json'},
		};
	}
	const id = await reposController.buildRepo(repoUrl, name, selectedFile, envVariables);
	if(id === 'invalid'){
		return {
			status: 400,
			headers: {'Content-Type': 'application/json'},
		};
	}
	if(id === 'name'){
		return {
			status: 409,
			headers: {'Content-Type': 'application/json'},
		};
	}
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
