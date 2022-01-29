import {getPassword} from '$lib/setup/password';

export const login = async(password:string):Promise<boolean> => {
	const pwd = await getPassword();
	return !(password !== pwd || pwd === '');
};
