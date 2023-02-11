import crypto from 'crypto';
import validator from 'validator';
import type FilesManager from '$lib/server/utils/FilesManager';
import { filesManager } from '$lib/server/utils/FilesManager';

export default class AuthController {
	constructor(private filesManager: FilesManager) {}

	public async setPassword(password: string): Promise<boolean> {
		const strength: number = <number>(<unknown>validator.isStrongPassword(password, {
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			returnScore: true
		}));
		if (strength < 42) {
			return false;
		}
		const salt = crypto.randomBytes(8).toString('hex');
		const hash = crypto.scryptSync(password, salt, 64).toString('hex');
		const data = hash + ':' + salt;
		await filesManager.writeFile('auth/password.txt', data);
		return true;
	}

	private async checkPassword(suppliedPassword: string): Promise<boolean> {
		const storedPassword = await this.filesManager.readFile('auth/password.txt');
		const [hashedPassword, salt] = storedPassword.split(':');
		const testHash = crypto.scryptSync(suppliedPassword, salt, 64);
		return crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), testHash);
	}

	public async login(password: string): Promise<boolean> {
		return await this.checkPassword(password);
	}

	public async checkPasswordSet(): Promise<boolean> {
		const password = await this.filesManager.readFile('auth/password.txt');
		return password.length > 0;
	}
}
