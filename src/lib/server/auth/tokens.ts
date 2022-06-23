import {checkPassword} from '$lib/server/setup/password';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const tokensPath = path.join(process.cwd(), 'lw-config', 'tokens.txt');

export const saveToken = async (token: string, password:string, service: string):Promise<boolean> => {
	if(!await checkPassword(password)) {
		return false;
	}
	const key = crypto.scryptSync(password, 'salt', 32);
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	const encryptedToken = cipher.update(token, 'utf8', 'hex') + cipher.final('hex');
	await fs.appendFile(tokensPath, `${service}:${iv.toString('hex')}:${encryptedToken}\n`);
	return true;
};

export const getAllTokens = async (password:string):Promise<{ service:string, token:string }[]> => {
	if(!await checkPassword(password)) {
		return [];
	}
	const key = crypto.scryptSync(password, 'salt', 32);
	const file = await fs.readFile(tokensPath, 'utf8');
	const lines = file.split('\n');
	const tokens = lines.filter(line => line.length > 1).map(line => {
		const [service, iv, encryptedToken] = line.split(':');
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
		const token = decipher.update(encryptedToken, 'hex', 'utf8') + decipher.final('utf8');
		return {service, token};
	});
	return tokens;
};
