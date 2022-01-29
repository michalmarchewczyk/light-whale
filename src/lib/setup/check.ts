import {getPassword} from '$lib/setup/password';

export const checkSetup = async ():Promise<boolean> => {
	const password = await getPassword();
	return !!password;
};
