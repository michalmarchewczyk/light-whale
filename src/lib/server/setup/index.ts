import SetupController from '$lib/server/setup/SetupController';
import { authController } from '$lib/server/auth';

export const setupController = new SetupController(authController);
