import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/docker/config';


export const checkNetwork = async ():Promise<boolean> => {
	const res = await fetch(DOCKER_URL+`/networks/${LW_NETWORK_NAME}`);
	return res.status === 200;
};
