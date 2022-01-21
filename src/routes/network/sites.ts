import type {RequestHandler} from '@sveltejs/kit';
import {getSites, pauseSite, removeSite, Site, unpauseSite} from '$lib/network/sites';
import {checkSession} from '$lib/auth/sessions';
import validator from 'validator';


const get:RequestHandler<Promise<void>, void> = async () => {
	let sites:Site[] = await getSites();
	sites = sites.sort((a, b) => b.created.getTime() - a.created.getTime());
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(sites),
	};
};

const put:RequestHandler<Promise<void>, { id:string, action:string }> = async ({body, headers}) => {
	if (!checkSession(headers)) {
		return {
			status: 401,
		};
	}
	const {id, action} = body;
	if (!validator.isAlphanumeric(id ?? '') || !validator.isAlphanumeric(action ?? '')) {
		return {
			status: 400,
		};
	}
	let res = false;
	if (action === 'unpause') {
		res = await unpauseSite(id);
	} else if (action === 'pause') {
		res = await pauseSite(id);
	}
	return {
		status: 200,
		body: JSON.stringify({success: res})
	};
};


const del:RequestHandler<Promise<void>, { id:string }> = async ({body, headers}) => {
	if (!checkSession(headers)) {
		return {
			status: 401,
		};
	}
	const {id} = body;
	if (!validator.isAlphanumeric(id ?? '')) {
		return {
			status: 400,
		};
	}
	const res = await removeSite(id);
	return {
		status: 200,
		body: JSON.stringify({success: res})
	};
};

export {
	get,
	put,
	del
};
