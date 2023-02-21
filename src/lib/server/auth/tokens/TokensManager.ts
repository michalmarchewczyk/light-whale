import type Token from '$lib/server/auth/tokens/Token';
import { logger } from '$lib/server/utils/Logger';
import crypto from 'crypto';
import type FilesManager from '$lib/server/utils/FilesManager';
import * as uuid from 'uuid';
import type AuthController from '$lib/server/auth/AuthController';

export default class TokensManager {
	private tokens: Token[] = [];

	constructor(private filesManager: FilesManager, private authController: AuthController) {
		logger.logVerbose('TokensManager initialized');
	}

	private static encryptToken(password: string, token: Token): string {
		const key = crypto.scryptSync(password, 'salt', 32);
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		const encryptedToken = cipher.update(token.token, 'utf8', 'hex') + cipher.final('hex');
		return `${token.id}:${token.description}:${token.date.valueOf()}:${
			token.service
		}:${encryptedToken}:${iv.toString('hex')}`;
	}

	private static decryptToken(serializedToken: string, password: string): Token {
		const key = crypto.scryptSync(password, 'salt', 32);
		const [id, description, date, service, encryptedToken, iv] = serializedToken.split(':');
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
		const token = decipher.update(encryptedToken, 'hex', 'utf8') + decipher.final('utf8');
		return {
			id,
			description,
			date: new Date(parseInt(date)),
			service,
			token
		};
	}

	public initialize(password: string): void {
		this.loadTokens(password).then(() => {
			logger.logVerbose('Tokens loaded');
		});
	}

	private async loadTokens(password: string): Promise<void> {
		const lines = (await this.filesManager.readFile('tokens.txt')).split('\n');
		this.tokens = lines
			.filter((l) => l.length > 1)
			.map((l) => TokensManager.decryptToken(l, password));
	}

	private async saveTokens(password: string): Promise<void> {
		await this.filesManager.writeFile(
			'tokens.txt',
			this.tokens.map((t) => TokensManager.encryptToken(password, t)).join('\n'),
			true
		);
	}

	public async addToken(token: string, password: string, service: string, description?: string) {
		if (!(await this.authController.confirmPassword(password))) {
			return false;
		}
		const newToken: Token = {
			id: uuid.v4(),
			service,
			token,
			date: new Date(),
			description: encodeURIComponent(description || '')
		};
		this.tokens.push(newToken);
		await this.saveTokens(password);
		logger.logInfo(`Token added for service ${service}`);
		return true;
	}

	public async removeToken(id: string, password: string) {
		if (!(await this.authController.confirmPassword(password))) {
			return false;
		}
		this.tokens = this.tokens.filter((t) => t.id !== id);
		await this.saveTokens(password);
		logger.logInfo(`Token removed with id ${id}`);
		return true;
	}

	public getTokensByService(service: string): Token[] {
		logger.logVerbose(`Getting tokens for service ${service}`);
		return this.tokens.filter((t) => t.service === service);
	}

	public getTokenById(id: string): Token | undefined {
		logger.logVerbose(`Getting token with id ${id}`);
		return this.tokens.find((t) => t.id === id);
	}
}
