import type {RequestHandler} from '@sveltejs/kit';
import {getContainers, removeContainer, restartContainer, startContainer, stopContainer} from '$lib/docker/containers';

const get:RequestHandler<Promise<void>, void> = async () => {
	const containers = await getContainers();
	return {
		status: 200,
		body: JSON.stringify(containers)
	};
};

const put:RequestHandler<Promise<void>, { id:string, action:string }> = async ({body}) => {
	const {id, action} = body;
	let res = false;
	if (action === 'start') {
		res = await startContainer(id);
	} else if (action === 'stop') {
		res = await stopContainer(id);
	} else if (action === 'restart') {
		res = await restartContainer(id);
	} else if (action === 'remove') {
		res = await removeContainer(id);
	}
	return {
		status: 200,
		body: JSON.stringify({success: res})
	};
};

export {
	get,
	put
};
