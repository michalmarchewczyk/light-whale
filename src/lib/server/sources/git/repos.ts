import path from 'path';
import fs from 'fs/promises';
import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';
import {logger, LogType} from '$lib/server/utils/Logger';

const gitSourcesPath = path.join(process.cwd(), 'git-sources');

const options:Partial<SimpleGitOptions> = {
	baseDir: path.join(process.cwd(), 'git-sources'),
	binary: 'git',
};

const git:SimpleGit = simpleGit(options);

export interface RepoInfo {
	remoteName:string,
	branchName:string,
	author:string,
	lastCommit:string,
	lastDate:string,
	foundDockerfiles:string[],
	foundComposeFiles:string[],
	topFile:string,
	topFileContent:string,
}

type RepoBasicInfo = Pick<RepoInfo, 'remoteName' | 'branchName' | 'author' | 'lastCommit' | 'lastDate'>;

type RepoDockerInfo = Pick<RepoInfo, 'foundDockerfiles' | 'foundComposeFiles' | 'topFile' | 'topFileContent'>;


const getRepoBasicInfo = async ():Promise<RepoBasicInfo> => {
	const remotes = await git.getRemotes(true);
	const mainRemote = remotes.find(remote => remote.name === 'origin') ?? remotes[0];
	const remoteName = mainRemote.refs.fetch;
	const branchName = await git.revparse(['--abbrev-ref', 'HEAD']);
	const lastCommitInfo = (await git.log({maxCount: 1})).latest;
	const author = `${lastCommitInfo.author_name} <${lastCommitInfo.author_email}>`;
	const lastCommit = lastCommitInfo.message;
	const lastDate = lastCommitInfo.date;
	return {remoteName, branchName, author, lastCommit, lastDate};
};

const getRepoDockerInfo = async():Promise<RepoDockerInfo> => {
	const foundDockerfiles = [...(await git.grep('FROM')).paths].filter(path => path.endsWith('Dockerfile'));
	const foundComposeFiles = [...(await git.grep('services:')).paths].filter(path => path.includes('docker-compose'));
	if(foundDockerfiles.length === 0 && foundComposeFiles.length === 0){
		return {foundDockerfiles, foundComposeFiles, topFile: '', topFileContent: ''};
	}
	let topFile = foundComposeFiles
		.filter(path => path.endsWith('docker-compose.yaml') || path.endsWith('docker-compose.yml'))
		.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length)
		?.[0];
	topFile = topFile ?? foundDockerfiles
		.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length)[0];
	const currentHash = await git.revparse(['--short', 'HEAD']);
	const topFileContent = await git.show(currentHash + ':' + topFile);
	return {foundDockerfiles, foundComposeFiles, topFile, topFileContent};
};

const pullRepo = async (repoUrl:string):Promise<boolean> => {
	await git.cwd(gitSourcesPath);
	const repoDir = path.join(gitSourcesPath, encodeURIComponent(repoUrl));
	try {
		await fs.access(repoDir);
		await git.cwd(repoDir);
		logger.log(LogType.Info, `Pulling git repository ${repoUrl}`);
		await git.pull();
		return true;
	} catch (e) {
		try {
			logger.log(LogType.Info, `Fetching git repository ${repoUrl}`);
			await git.clone(repoUrl, repoDir);
			await git.cwd(repoDir);
			return true;
		} catch (e) {
			logger.log(LogType.Error, `Could not fetch git repository ${repoUrl}`);
			return false;
		}
	}
};


export const fetchRepo = async (repoUrl:string):Promise<RepoInfo|null> => {
	const pulled = await pullRepo(repoUrl);
	if(!pulled){
		return null;
	}
	try {
		const basicInfo = await getRepoBasicInfo();
		const dockerInfo = await getRepoDockerInfo();
		const repoInfo:RepoInfo = {
			...basicInfo,
			...dockerInfo
		};
		await fs.writeFile(path.join(gitSourcesPath, encodeURIComponent(repoUrl)+'.json'),
			JSON.stringify(repoInfo),
			{flag: 'w', encoding: 'utf-8'});
		return repoInfo;
	}catch(e){
		logger.log(LogType.Error, 'Something went wrong reading repository information');
		return null;
	}
};


export const listRepos = async():Promise<Partial<RepoInfo>[]> => {
	logger.log(LogType.Info, 'Listing git repositories');
	try {
		const files = (await fs.readdir(gitSourcesPath, {withFileTypes: true}))
			.filter(d => d.isFile());
		const repos:Partial<RepoInfo>[] = [];
		for(const file of files){
			const data = await fs.readFile(path.join(gitSourcesPath, file.name), {encoding: 'utf-8'});
			const repoInfo:RepoInfo = JSON.parse(data);
			repos.push(repoInfo);
		}
		return repos;
	}catch(e){
		logger.log(LogType.Error, 'Something went wrong while listing repositories');
		return [];
	}
};
