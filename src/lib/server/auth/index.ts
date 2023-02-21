import AuthController from '$lib/server/auth/AuthController';
import { filesManager } from '$lib/server/utils/FilesManager';
import SessionManager from '$lib/server/auth/SessionManager';
import TokensManager from '$lib/server/auth/tokens/TokensManager';

export const sessionManager = new SessionManager();

export const authController = new AuthController(filesManager);

export const tokensManager = new TokensManager(filesManager, authController);
