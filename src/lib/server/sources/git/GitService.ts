import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';

export default abstract class GitService {
	public static serviceName: string;

	protected constructor(protected tokensManager: TokensManager) {}

	abstract getTokens(): Promise<GitServiceToken[]>;
}
