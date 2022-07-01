import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import { authGuard } from '$lib/server/auth/authGuard';
import {imagesController} from '$lib/server/docker';

const get:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const images = await imagesController.getImages();
	return {
		status: 200,
		body: JSON.stringify(images),
	};
};

const post:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
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
	const res = await imagesController.pullImage(name, tag);
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};


export {
	get,
	post
};
