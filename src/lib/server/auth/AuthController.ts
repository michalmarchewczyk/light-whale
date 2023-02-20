import crypto from 'crypto';
import validator from 'validator';
import type FilesManager from '$lib/server/utils/FilesManager';
import { filesManager } from '$lib/server/utils/FilesManager';
import { logger } from '$lib/server/utils/Logger';

export default class AuthController {
	private tempData: Record<string, string> = {};

	constructor(private filesManager: FilesManager) {
		logger.logVerbose('AuthController initialized');
	}

	public async setTempData(key: string, value: string) {
		if (await this.checkPasswordSet()) {
			return;
		}
		this.tempData[key] = value;
	}

	public async getTempData(key: string): Promise<string | undefined> {
		if (await this.checkPasswordSet()) {
			return;
		}
		return this.tempData[key];
	}

	public async setPassword(password: string): Promise<boolean> {
		logger.logInfo('Setting password');
		const strength: number = <number>(<unknown>validator.isStrongPassword(password, {
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			returnScore: true
		}));
		if (strength < 42) {
			logger.logError('Password is not strong enough');
			return false;
		}
		const salt = crypto.randomBytes(8).toString('hex');
		const hash = crypto.scryptSync(password, salt, 64).toString('hex');
		const data = hash + ':' + salt;
		await filesManager.writeFile('auth/password.txt', data);
		logger.logInfo('Password set');
		return true;
	}

	private async checkPassword(suppliedPassword: string): Promise<boolean> {
		const storedPassword = await this.filesManager.readFile('auth/password.txt');
		const [hashedPassword, salt] = storedPassword.split(':');
		const testHash = crypto.scryptSync(suppliedPassword, salt, 64);
		return crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), testHash);
	}

	public async login(password: string): Promise<boolean> {
		logger.logInfo('Logging in');
		const res = await this.checkPassword(password);
		if (res) {
			logger.logInfo('Login successful');
		} else {
			logger.logError('Login failed');
		}
		return res;
	}

	public async confirmPassword(password: string): Promise<boolean> {
		logger.logInfo('Confirming password');
		const res = await this.checkPassword(password);
		if (res) {
			logger.logInfo('Password confirmed');
		} else {
			logger.logError('Password confirmation failed');
		}
		return res;
	}

	public async checkPasswordSet(): Promise<boolean> {
		logger.logVerbose('Checking if password is set');
		const password = await this.filesManager.readFile('auth/password.txt');
		return password.length > 0;
	}
}
