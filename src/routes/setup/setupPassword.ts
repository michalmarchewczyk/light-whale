import type {RequestHandler} from '@sveltejs/kit';
import {setPassword} from '$lib/setup/password';

const post:RequestHandler<void, { password:string }> = async ({body}) => {
	const {password} = body;
	if (!password || password.length < 4) {
		return {
			status: 400,
			body: 'no-password',
		};
	}
	const set = await setPassword(password);
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