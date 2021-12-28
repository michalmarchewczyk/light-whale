import {dockerUrl} from '$lib/docker/config';

export const pingDocker = async ():Promise<boolean> => {
	try {
		const res = await fetch(dockerUrl+'_ping', {
			mode: 'cors',
		});
		return res.status === 200;
	}catch(e){
		return false;
	}

};
