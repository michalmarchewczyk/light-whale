import AuthController from '$lib/server/auth/AuthController';
import { filesManager } from '$lib/server/utils/FilesManager';
import SessionManager from '$lib/server/auth/SessionManager';

export const sessionManager = new SessionManager();

export const authController = new AuthController(filesManager);
