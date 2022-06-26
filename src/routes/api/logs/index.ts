import type {RequestHandler} from '@sveltejs/kit';
import Logger from '$lib/server/utils/Logger';
import { authGuard } from '$lib/server/auth/authGuard';


const get:RequestHandler = ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const logger = Logger.getInstance();
	const logs = logger.get().map(log => ({...log, date: log.date.toISOString()}));
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(logs)
	};
};

export {
	get
};
