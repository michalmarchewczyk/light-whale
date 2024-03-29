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
import GitlabService from '$lib/server/sources/git/gitlab/GitlabService';
import BitbucketService from '$lib/server/sources/git/bitbucket/BitbucketService';
import JetbrainsSpaceService from '$lib/server/sources/git/jetbrainsSpace/JetbrainsSpaceService';

const git = simpleGit({
	binary: 'git'
});

const githubService = new GithubService(tokensManager);

const gitlabService = new GitlabService(tokensManager);

const bitbucketService = new BitbucketService(tokensManager);

const jetbrainsSpaceService = new JetbrainsSpaceService(tokensManager);

export const gitServicesController = new GitServicesController([
	githubService,
	gitlabService,
	bitbucketService,
	jetbrainsSpaceService
]);

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
