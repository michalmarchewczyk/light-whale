import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/auth/sessions';
import {getImages, pullImage, removeImage} from '$lib/docker/images';
import validator from 'validator';

const get:RequestHandler<Promise<void>, void> = async ({headers}) => {
	if (!checkSession(headers)) {
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

const del:RequestHandler<Promise<void>, { id:string }> = async ({body, headers}) => {
	if (!checkSession(headers)) {
		return {
			status: 401,
		};
	}
	const {id} = body;
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

const post:RequestHandler<void, {name:string, tag:string}> = async ({body, headers}) => {
	if (!checkSession(headers)) {
		return {
			status: 401,
		};
	}
	const {name, tag} = body;
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
