import AuthController from '$lib/server/auth/AuthController';
import { filesManager } from '$lib/server/utils/FilesManager';

export const authController = new AuthController(filesManager);
