import {authController} from '$lib/server/auth/AuthController';

export const checkSetup = async ():Promise<boolean> => {
	return authController.isPasswordSet();
};
