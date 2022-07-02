import ReposController from '$lib/server/sources/git/ReposController';
import RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import RepoBuilder from '$lib/server/sources/git/RepoBuilder';
import simpleGit from 'simple-git';
import RepoFilesReader from '$lib/server/sources/git/RepoFilesReader';


const git = simpleGit({
	binary: 'git'
});

export const repoBuilder = new RepoBuilder(ReposController.gitSourcesPath);

export const repoAnalyzer = new RepoAnalyzer(git);

export const reposController = new ReposController(git, repoAnalyzer, repoBuilder);

export const repoFilesReader = new RepoFilesReader();

export * from '$lib/server/sources/git/services';
