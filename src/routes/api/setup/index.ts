import type {RequestHandler} from '@sveltejs/kit';
import {setupController} from '$lib/server/setup/SetupController';

const get:RequestHandler = async () => {
	const status = await setupController.getCurrentStatus();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(status),
	};
};

const post:RequestHandler = async ({request}) => {
	const status = await setupController.getCurrentStatus();
	const {stage, password} = await request.json();
	if(status.stage !== stage){
		return {
			status: 400
		};
	}
	if(status.working){
		return {
			status: 500
		};
	}
	if(stage === 'no-docker'){
		// TODO: automatically install docker
	}
	if(stage === 'no-nginx'){
		await setupController.setupNginx();
	}
	if(stage === 'no-password'){
		await setupController.setupPassword(password);
	}
	const newStatus = await setupController.getCurrentStatus();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(newStatus),
	};
};

export {
	get,
	post,
};
