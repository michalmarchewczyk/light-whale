import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/server/auth/sessions';
import {getImages, pullImage, removeImage} from '$lib/server/docker/images';
import validator from 'validator';

const get:RequestHandler<Promise<void>, string> = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const images = await getImages();
	return {
		status: 200,
		body: JSON.stringify(images),
	};
};

const del:RequestHandler<Promise<void>, string> = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const {id} = await request.json();
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

const post:RequestHandler<void> = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const {name, tag} = await request.json();
	if (!validator.isAlphanumeric(name,'en-US', {ignore: '.-/'}) || !validator.isAlphanumeric(tag,'en-US', {ignore: '.-'})) {
		return {
			status: 400,
		};
	}
	const res = await pullImage(name, tag);
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};

export {
	get,
	del,
	post
};
