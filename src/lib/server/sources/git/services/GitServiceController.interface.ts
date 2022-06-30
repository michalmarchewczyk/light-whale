import type {GitServiceToken} from '$lib/server/sources/git/services/GitServiceToken.interface';
import type {GitServiceRepo} from '$lib/server/sources/git/services/GitServiceRepo.interface';

export interface GitServiceController {
	getTokensInfo():Promise<GitServiceToken[]>;
	listRepos():Promise<GitServiceRepo[]>;
}
