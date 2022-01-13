import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/auth/sessions';
import {getImages, removeImage} from '$lib/docker/images';
import validator from 'validator';

const get:RequestHandler<Promise<void>, void> = async ({headers}) => {
	if(!checkSession(headers)){
		return {
			status: 401,
		};
	}
	const images = await getImages();
	return {
		status: 200,
		body: JSON.stringify(images)
	};
};

const del:RequestHandler<Promise<void>, { id:string }> = async ({body, headers}) => {
	if(!checkSession(headers)){
		return {
			status: 401,
		};
	}
	const {id} = body;
	if(!validator.isHash(id.substring(7) ?? '', 'sha256')){
		return {
			status: 400,
		};
	}
	const res = await removeImage(id);
	return {
		status: 200,
		body: JSON.stringify({success: res})
	};
};

export {
	get,
	del
};