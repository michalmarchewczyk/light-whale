import type {EndpointOutput, RequestHandler} from '@sveltejs/kit';
import {getContainers, restartContainer, startContainer, stopContainer} from '$lib/docker/containers';

export async function get():Promise<EndpointOutput> {
	const containers = await getContainers();
	return {
		status: 200,
		body: JSON.stringify(containers)
	};
}


const put:RequestHandler<Promise<void>, {id:string, action:string}>
	= async ({body}) => {
		const {id, action} = body;
		let res = false;
		if(action === 'start'){
			res = await startContainer(id);
		}else if(action === 'stop'){
			res = await stopContainer(id);
		}else if(action === 'restart'){
			res = await restartContainer(id);
		}
		return {
			status: 200,
			body: JSON.stringify({success: res})
		};
	};

export {
	put
};
