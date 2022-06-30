import GithubController from '$lib/server/sources/git/services/github/GithubController';
import {tokenManager} from '$lib/server/auth';

export const githubController = new GithubController(tokenManager);
