import type {RequestHandler} from '@sveltejs/kit';

import validator from 'validator';
import { authGuard } from '$lib/server/auth/authGuard';
import {imagesController} from '$lib/server/docker';

const del:RequestHandler = async ({params, request}) => {
	if (!authGuard(request.headers)) {
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
	const res = await imagesController.removeImage(id);
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};

export {
	del
};
