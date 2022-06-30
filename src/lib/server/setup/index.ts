import SetupController from '$lib/server/setup/SetupController';
import SetupChecker from '$lib/server/setup/SetupChecker';
import SetupNginxChecker from '$lib/server/setup/SetupNginxChecker';
import SetupNginxController from '$lib/server/setup/SetupNginxController';
import {authController} from '$lib/server/auth';

export const setupNginxController = new SetupNginxController();

export const setupNginxChecker = new SetupNginxChecker();

export const setupChecker = new SetupChecker(setupNginxChecker, authController);

export const setupController = new SetupController(setupChecker, setupNginxController);
