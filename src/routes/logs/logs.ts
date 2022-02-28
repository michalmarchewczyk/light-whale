import type {RequestHandler} from '@sveltejs/kit';
import Logger from '$lib/utils/Logger';
import {checkSession} from '$lib/auth/sessions';

const get:RequestHandler = ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const logger = Logger.getInstance();
	const logs = logger.get();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(logs)
	};
};

export {
	get
};
