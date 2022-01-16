import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/auth/sessions';
import validator from 'validator';
import {getContainerLogs} from '$lib/docker/containers';

const get:RequestHandler = async ({query, headers}) => {
	if(!checkSession(headers)){
		return {
			status: 401,
		};
	}
	const id = query.get('id') ?? '';
	if (!id) {
		return {
			status: 400
		};
	}
	if(!validator.isAlphanumeric(id)){
		return {
			status: 400,
		};
	}
	const data = await getContainerLogs(id);
	return {
		status: 200,
		body: data,
	};
};

export {
	get
};
