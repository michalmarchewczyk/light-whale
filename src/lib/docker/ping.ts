import {DOCKER_URL} from '$lib/docker/config';

export const pingDocker = async ():Promise<boolean> => {
	try {
		const res = await fetch(DOCKER_URL + '/_ping');
		return res.status === 200;
	} catch (e) {
		return false;
	}
};

