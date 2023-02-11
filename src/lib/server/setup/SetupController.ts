import type AuthController from '$lib/server/auth/AuthController';

export default class SetupController {
	constructor(private authController: AuthController) {}

	async checkSetup(): Promise<boolean> {
		return await this.authController.checkPasswordSet();
	}
}
