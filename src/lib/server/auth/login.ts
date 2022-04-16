import {checkPassword} from '$lib/server/setup/password';
import {logger, LogType} from '$lib/server/utils/Logger';

export const login = async(password:string):Promise<boolean> => {
	logger.log(LogType.Info, 'Attempting to login');
	const passwordGood = await checkPassword(password);
	logger.log(passwordGood ? LogType.Info : LogType.Warning, `Login attempt ${passwordGood ? 'successful' : 'unsuccessful'}`);
	return passwordGood;
};
