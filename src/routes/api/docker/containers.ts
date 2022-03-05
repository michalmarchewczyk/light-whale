import type {RequestHandler} from '@sveltejs/kit';
import {
	createContainer,
	getContainers,
	removeContainer,
	restartContainer,
	startContainer,
	stopContainer,
} from '$lib/server/docker/containers';
import {checkSession} from '$lib/server/auth/sessions';
import validator from 'validator';

const get:RequestHandler<Promise<void>, string> = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const containers = await getContainers();
	return {
		status: 200,
		body: JSON.stringify(containers),
	};
};

const put:RequestHandler<Promise<void>, string> = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const {id, action} = await request.json();
	if (!validator.isAlphanumeric(id ?? '') || !validator.isAlphanumeric(action ?? '')) {
		return {
			status: 400,
		};
	}
	let res;
	if (action === 'start') {
		res = await startContainer(id);
	} else if (action === 'stop') {
		res = await stopContainer(id);
	} else if (action === 'restart') {
		res = await restartContainer(id);
	} else if (action === 'remove') {
		res = await removeContainer(id);
	} else {
		res = false;
	}
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};

const post:RequestHandler<Promise<void>> = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const {imageId, name, command} = await request.json();
	if (!validator.isHash(imageId.substring(7) ?? '', 'sha256')
		|| !(validator.matches(name, /^\/?[a-zA-Z0-9][a-zA-Z0-9_.-]+$/) || name === '')) {
		return {
			status: 400,
		};
	}
	const res = await createContainer(imageId, name, command);
	if (res) {
		return {
			status: 200,
		};
	} else {
		return {
			status: 500,
		};
	}
};

export {
	get,
	put,
	post,
};
