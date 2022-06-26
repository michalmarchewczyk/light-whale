import type {RequestHandler} from '@sveltejs/kit';
import {authController} from '$lib/server/auth/AuthController';

const post:RequestHandler = async ({request}) => {
	const {password} = await request.json();
	if (!password || password.length < 4) {
		return {
			status: 400,
			body: 'no-password',
		};
	}
	const set = await authController.setPassword(password);
	if(!set){
		return {
			status: 500,
		};
	}
	return {
		status: 200,
		body: 'ok',
	};
};

export {
	post,
};
