import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import { authGuard } from '$lib/server/auth/authGuard';
import {repoFilesReader, reposController} from '$lib/server/sources/git';

const get:RequestHandler = async ({params, url, request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const repoUrl = params.repo_url;
	if (!repoUrl) {
		return {
			status: 400,
		};
	}
	const path = url.searchParams.get('path') ?? '';
	if (!validator.isURL(path, {
		require_valid_protocol: false,
		require_host: false,
	})) {
		return {
			status: 400,
		};
	}
	const repo = await reposController.getRepo(repoUrl);
	if(!repo){
		return {
			status: 500,
		};
	}
	const data = await repoFilesReader.readPath(repo, path);
	if(typeof data === 'string'){
		return {
			status: 200,
			body: JSON.stringify({type: 'file', data}),
		};
	}else{
		if (!data || data.length < 1) {
			return {
				status: 400,
			};
		}
		return {
			status: 200,
			body: JSON.stringify({type: 'folder', data}),
		};
	}
};

export {
	get,
};
