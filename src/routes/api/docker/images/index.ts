import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/server/auth/sessions';
import {getImages, pullImage} from '$lib/server/docker/images';
import validator from 'validator';

const get:RequestHandler = async ({request}) => {
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

const post:RequestHandler = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const {name, tag} = await request.json();
	if (!validator.isAlphanumeric(name,'en-US', {ignore: '.-/'})
		|| !validator.isAlphanumeric(tag,'en-US', {ignore: '.-'})) {
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
	post
};
