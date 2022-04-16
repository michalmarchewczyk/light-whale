import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/server/docker/config';
import {logger, LogType} from '$lib/server/utils/Logger';


export const checkNetwork = async ():Promise<boolean> => {
	logger.log(LogType.Verbose, 'Checking LW network');
	try {
		const res = await fetch(DOCKER_URL+`/networks/${LW_NETWORK_NAME}`);
		return res.status === 200;
	}catch (e) {
		return false;
	}
};
