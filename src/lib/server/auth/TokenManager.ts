import path from 'path';
import fs from 'fs/promises';
import {logger, LogType} from '$lib/server/utils/Logger';
import uuid from 'uuid';
import crypto from 'crypto';
import type {Token} from '$lib/server/auth/Token.interface';

export default class TokenManager {
	private static tokensFilepath: string;
	private tokens:Token[] = [];

	constructor() {
		TokenManager.tokensFilepath = path.join(process.cwd(), 'lw-config', 'tokens.txt');
		fs.writeFile(TokenManager.tokensFilepath, '', {flag: 'a'}).then(() => {
			logger.log(LogType.Info, 'TokenManager file initialized');
		});
	}

	private static encryptToken(password:string, token:Token):string {
		const key = crypto.scryptSync(password, 'salt', 32);
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		const encryptedToken = cipher.update(token.token, 'utf8', 'hex') + cipher.final('hex');
		return `${token.id}:${token.description}:${token.date.valueOf()}:${token.service}:${encryptedToken}:${iv.toString('hex')}`;
	}

	private static decryptToken(serializedToken:string, password:string):Token {
		const key = crypto.scryptSync(password, 'salt', 32);
		const [id, description, date, service, encryptedToken, iv] = serializedToken.split(':');
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
		const token = decipher.update(encryptedToken, 'hex', 'utf8') + decipher.final('utf8');
		return {
			id,
			description,
			date: new Date(parseInt(date)),
			service,
			token,
		};
	}

	public initialize(password:string):void{
		this.loadTokens(password).then(() => {
			logger.log(LogType.Info, 'TokenManager tokens loaded');
		});
	}

	private async loadTokens(password:string):Promise<void> {
		const file = await fs.readFile(TokenManager.tokensFilepath, {encoding: 'utf8'});
		const lines = file.split('\n');
		this.tokens = lines.filter(line => line.length > 1).map(line => {
			return TokenManager.decryptToken(line, password);
		});
	}

	private async saveTokens(password:string):Promise<void> {
		let content = '';
		this.tokens.forEach(token => {
			const tokenString = TokenManager.encryptToken(password, token);
			content += tokenString + '\n';
		});
		await fs.writeFile(TokenManager.tokensFilepath, content, {flag: 'w+'});
	}

	private async updateTokens():Promise<void> {
		const file = await fs.readFile(TokenManager.tokensFilepath, 'utf8');
		let lines = file.split('\n');
		const tokenIds = this.tokens.map(token => token.id);
		lines = lines.filter(l => tokenIds.includes(l.split(':')[0]));
		await fs.writeFile(TokenManager.tokensFilepath, lines.join('\n'));
	}

	public async addToken(token: string, password:string, service: string, description?: string):Promise<boolean> {
		const newToken:Token = {
			id: uuid.v4(),
			service,
			token,
			date: new Date(),
			description: encodeURIComponent(description) ?? '',
		};
		this.tokens.push(newToken);
		await this.saveTokens(password);
		return true;
	}

	public async removeToken(id:string):Promise<boolean> {
		this.tokens = this.tokens.filter(t => t.id !== id);
		await this.updateTokens();
		return true;
	}

	public getTokensByService(service: string):Token[] {
		return this.tokens.filter(token => token.service === service);
	}

	public getTokenById(id:string):Token {
		return this.tokens.find(token => token.id === id);
	}
}
