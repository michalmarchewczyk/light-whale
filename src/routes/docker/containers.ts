import type {RequestHandler} from '@sveltejs/kit';
import {getContainers, removeContainer, restartContainer, startContainer, stopContainer} from '$lib/docker/containers';
import {checkSession} from '$lib/auth/sessions';
import validator from 'validator';

const get:RequestHandler<Promise<void>, void> = async ({headers}) => {
	if(!checkSession(headers)){
		return {
			status: 401,
		};
	}
	const containers = await getContainers();
	return {
		status: 200,
		body: JSON.stringify(containers)
	};
};

const put:RequestHandler<Promise<void>, { id:string, action:string }> = async ({body, headers}) => {
	if(!checkSession(headers)){
		return {
			status: 401,
		};
	}
	const {id, action} = body;
	if(!validator.isAlphanumeric(id ?? '') || !validator.isAlphanumeric(action ?? '')){
		return {
			status: 400,
		};
	}
	let res = false;
	if (action === 'start') {
		res = await startContainer(id);
	} else if (action === 'stop') {
		res = await stopContainer(id);
	} else if (action === 'restart') {
		res = await restartContainer(id);
	} else if (action === 'remove') {
		res = await removeContainer(id);
	}
	return {
		status: 200,
		body: JSON.stringify({success: res})
	};
};

export {
	get,
	put
};
