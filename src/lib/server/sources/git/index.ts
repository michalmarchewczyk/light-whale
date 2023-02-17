import GitServicesController from '$lib/server/sources/git/GitServicesController';
import GithubService from '$lib/server/sources/git/github/GithubService';
import { tokensManager } from '$lib/server/auth';

const githubService = new GithubService(tokensManager);

export const gitServicesController = new GitServicesController([githubService]);
