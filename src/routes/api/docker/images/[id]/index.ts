import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/server/auth/sessions';
import validator from 'validator';
import {removeImage} from '$lib/server/docker/images';

const del:RequestHandler = async ({params, request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const id = params.id;
	if (!validator.isHash(id.substring(7) ?? '', 'sha256')) {
		return {
			status: 400,
		};
	}
	const res = await removeImage(id);
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};

export {
	del
};
