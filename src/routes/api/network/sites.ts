import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import {authGuard} from '$lib/server/auth/authGuard';
import type {Site} from '$lib/server/network/Site.interface';
import {sitesManager} from '$lib/server/network';


const get:RequestHandler = async () => {
	let sites:Site[] = await sitesManager.getSites();
	sites = sites.sort((a, b) => b.created.getTime() - a.created.getTime());
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(sites),
	};
};

const put:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
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
	if (action === 'unpause') {
		res = await sitesManager.unpauseSite(id);
	} else if (action === 'pause') {
		res = await sitesManager.pauseSite(id);
	} else {
		res = false;
	}
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};


const del:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const {id} = await request.json();
	if (!validator.isAlphanumeric(id ?? '')) {
		return {
			status: 400,
		};
	}
	const res = await sitesManager.removeSite(id);
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};


const post:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const {containerId, domain, port} = await request.json();
	if (!validator.isFQDN(domain ?? '') || !validator.isAlphanumeric(containerId) || !validator.isPort(port.toString())) {
		return {
			status: 400,
		};
	}
	const res = await sitesManager.createSite(containerId, domain, port);
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};

export {
	get,
	put,
	del,
	post,
};
