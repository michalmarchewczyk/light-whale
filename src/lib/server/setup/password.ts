import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import {logger, LogType} from '$lib/server/utils/Logger';

const passwordPath = path.join(process.cwd(), 'lw-config', 'password.txt');

export const getPassword = async ():Promise<string> => {
	return await fs.readFile(passwordPath, {encoding: 'utf-8'}).catch(() => '') ?? '';
};

export const checkPassword = async (suppliedPassword:string):Promise<boolean> => {
	const storedPassword = await getPassword();
	const [hashedPassword, salt] = storedPassword.split(':');
	const testHash = crypto.scryptSync(suppliedPassword, salt, 64);
	return crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), testHash);
};

export const setPassword = async (password:string):Promise<boolean> => {
	logger.log(LogType.Info, 'Setting up password');
	const salt = crypto.randomBytes(8).toString('hex');
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');
	const data = hash + ':' + salt;
	await fs.writeFile(passwordPath, data, {encoding: 'utf-8'});
	logger.log(LogType.Info, 'Password set up');
	return true;
};
