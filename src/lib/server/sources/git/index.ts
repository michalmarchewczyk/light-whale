import GitServicesController from '$lib/server/sources/git/GitServicesController';
import GithubService from '$lib/server/sources/git/github/GithubService';
import { tokensManager } from '$lib/server/auth';
import ReposManager from '$lib/server/sources/git/ReposManager';
import { filesManager } from '$lib/server/utils/FilesManager';
import RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import simpleGit from 'simple-git';
import RepoFilesReader from '$lib/server/sources/git/RepoFilesReader';
import RepoBuilder from '$lib/server/sources/git/RepoBuilder';
import { processesManager } from '$lib/server/processes';

const git = simpleGit({
	binary: 'git'
});

const githubService = new GithubService(tokensManager);

export const gitServicesController = new GitServicesController([githubService]);

export const repoAnalyzer = new RepoAnalyzer(git);

export const reposManager = new ReposManager(
	git,
	filesManager,
	tokensManager,
	repoAnalyzer,
	gitServicesController
);

export const repoFilesReader = new RepoFilesReader(filesManager);

export const repoBuilder = new RepoBuilder(filesManager, processesManager);
