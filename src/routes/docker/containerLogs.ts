import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/auth/sessions';
import validator from 'validator';
import {getContainerLogs} from '$lib/docker/containers';

const get:RequestHandler = async ({url, headers}) => {
	if (!checkSession(headers)) {
		return {
			status: 401,
		};
	}
	const id = url.searchParams.get('id') ?? '';
	if (!id) {
		return {
			status: 400
		};
	}
	if (!validator.isAlphanumeric(id)) {
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
