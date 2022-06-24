import {checkPassword} from '$lib/server/setup/password';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import uuid from 'uuid';

const tokensPath = path.join(process.cwd(), 'lw-config', 'tokens.txt');

export interface Token {
	id: string,
	service: string;
	token: string;
	date: Date,
	description: string;
}

let tokens:Token[] = [];

export const saveToken = async (token: string, password:string, service: string, description?: string):Promise<boolean> => {
	if(!await checkPassword(password)) {
		return false;
	}
	const newToken:Token = {
		id: uuid.v4(),
		service,
		token,
		date: new Date(),
		description: encodeURIComponent(description) ?? '',
	};
	const key = crypto.scryptSync(password, 'salt', 32);
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	const encryptedToken = cipher.update(newToken.token, 'utf8', 'hex') + cipher.final('hex');
	const tokenString = `${newToken.id}:${newToken.description}:${newToken.date.valueOf()}:${newToken.service}:${encryptedToken}:${iv.toString('hex')}`;
	await fs.appendFile(tokensPath, tokenString + '\n');
	tokens.push(newToken);
	return true;
};

export const removeToken = async (id:string):Promise<boolean> => {
	tokens = tokens.filter(t => t.id !== id);
	const file = await fs.readFile(tokensPath, 'utf8');
	let lines = file.split('\n');
	lines = lines.filter(l => l.split(':')[0] !== id);
	await fs.writeFile(tokensPath, lines.join('\n'));
	return true;
};

export const readAllTokens = async (password:string):Promise<void>=> {
	if(!await checkPassword(password)) {
		return;
	}
	const key = crypto.scryptSync(password, 'salt', 32);
	const file = await fs.readFile(tokensPath, 'utf8');
	const lines = file.split('\n');
	tokens = lines.filter(line => line.length > 1).map(line => {
		const [id, description, date, service, encryptedToken, iv] = line.split(':');
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
		const token = decipher.update(encryptedToken, 'hex', 'utf8') + decipher.final('utf8');
		return {
			id,
			description,
			date: new Date(parseInt(date)),
			service,
			token,
		};
	});
};


export const getAllTokens = ():Token[] => {
	return tokens;
};
