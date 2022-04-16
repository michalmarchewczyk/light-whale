import {DOCKER_URL} from '$lib/server/docker/config';
import {logger, LogType} from '$lib/server/utils/Logger';

export const pingDocker = async ():Promise<boolean> => {
	try {
		logger.log(LogType.Verbose, 'Pinging Docker');
		const res = await fetch(DOCKER_URL + '/_ping');
		return res.status === 200;
	} catch (e) {
		return false;
	}
};

