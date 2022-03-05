import {getPassword} from '$lib/server/setup/password';

export const checkSetup = async ():Promise<boolean> => {
	const password = await getPassword();
	return !!password;
};
