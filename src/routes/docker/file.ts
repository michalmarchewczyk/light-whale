import type {RequestHandler} from '@sveltejs/kit';
import {execCommand} from '$lib/docker/exec';
import {checkSession} from '$lib/auth/sessions';
import validator from 'validator';

const get:RequestHandler = async ({url, request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const id = url.searchParams.get('id') ?? '';
	const path = url.searchParams.get('path') ?? '';
	if (!id) {
		return {
			status: 400,
		};
	}
	if (!validator.isAlphanumeric(id) || !validator.isURL(path, {
		require_valid_protocol: false,
		require_host: false,
	})) {
		return {
			status: 400,
		};
	}
	const data = await execCommand(id, `cat ${path}`);
	if (!data) {
		return {
			status: 400,
		};
	}
	return {
		status: 200,
		body: data,
	};
};

export {
	get,
};
