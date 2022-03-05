import {checkPassword} from '$lib/server/setup/password';

export const login = async(password:string):Promise<boolean> => {
	return await checkPassword(password);
};
