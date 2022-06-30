import ReposController from '$lib/server/sources/git/ReposController';
import RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import RepoBuilder from '$lib/server/sources/git/RepoBuilder';
import simpleGit from 'simple-git';


const git = simpleGit({
	binary: 'git'
});

export const repoBuilder = new RepoBuilder(ReposController.gitSourcesPath);

export const repoAnalyzer = new RepoAnalyzer(git);

export const reposController = new ReposController(git, repoAnalyzer, repoBuilder);

export * from '$lib/server/sources/git/services';
