import {logger, LogType} from '$lib/server/utils/Logger';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import validator from 'validator';

class AuthController {
	private static instance: AuthController;
	private static passwordPath:string;

	private constructor() {
		AuthController.passwordPath = path.join(process.cwd(), 'lw-config', 'password.txt');
		fs.writeFile(AuthController.passwordPath, '', {flag: 'a'}).then(() => {
			logger.log(LogType.Info, 'AuthController file initialized');
		});
	}

	public static getInstance(): AuthController {
		if (!AuthController.instance) {
			AuthController.instance = new AuthController();
		}
		return AuthController.instance;
	}

	public async setPassword(password:string):Promise<boolean> {
		logger.log(LogType.Info, 'Setting up password');
		const strength:number = <number><unknown>validator.isStrongPassword(password, {
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			returnScore: true,
		});
		if(strength < 42){
			logger.log(LogType.Warning, 'Password strength is too low');
			return false;
		}
		const salt = crypto.randomBytes(8).toString('hex');
		const hash = crypto.scryptSync(password, salt, 64).toString('hex');
		const data = hash + ':' + salt;
		await fs.writeFile(AuthController.passwordPath, data, {encoding: 'utf-8', flag: 'w'});
		logger.log(LogType.Info, 'Password set up');
		return true;
	}

	private async checkPassword(suppliedPassword:string):Promise<boolean> {
		const storedPassword = await fs.readFile(AuthController.passwordPath, {encoding: 'utf-8'}).catch(() => '') ?? '';
		const [hashedPassword, salt] = storedPassword.split(':');
		const testHash = crypto.scryptSync(suppliedPassword, salt, 64);
		return crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), testHash);
	}

	public async login(password:string):Promise<boolean> {
		logger.log(LogType.Info, 'Attempting to login');
		const passwordGood = await this.checkPassword(password);
		logger.log(passwordGood ? LogType.Info : LogType.Warning, `Login attempt ${passwordGood ? 'successful' : 'unsuccessful'}`);
		return passwordGood;
	}

	public async isPasswordSet():Promise<boolean> {
		return (await fs.readFile(AuthController.passwordPath, {encoding: 'utf-8'}).catch(() => '')).length > 0;
	}
}


export const authController = AuthController.getInstance();

export default AuthController;
