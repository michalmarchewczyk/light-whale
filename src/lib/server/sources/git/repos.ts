import path from 'path';
import fs from 'fs/promises';
import simpleGit, {CheckRepoActions, SimpleGit, SimpleGitOptions} from 'simple-git';
import Logger, {LogType} from '$lib/server/utils/Logger';

const logger = Logger.getInstance();

const gitSourcesPath = path.join(process.cwd(), 'git-sources');

const options:Partial<SimpleGitOptions> = {
	baseDir: path.join(process.cwd(), 'git-sources'),
	binary: 'git',
};

const git:SimpleGit = simpleGit(options);

export interface RepoInfo {
	remoteName:string,
	branchName:string,
	foundDockerfiles:string[],
	foundComposeFiles:string[],
	topFile:string,
	topFileContent:string,
}


const getRepoDockerInfo = async():Promise<Partial<RepoInfo>> => {
	const foundDockerfiles = [...(await git.grep('FROM')).paths].filter(path => path.endsWith('Dockerfile'));
	const foundComposeFiles = [...(await git.grep('services:')).paths].filter(path => path.includes('docker-compose'));
	if(foundDockerfiles.length === 0 && foundComposeFiles.length === 0){
		return {};
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


const getRepoBasicInfo = async () => {
	const remotes = await git.getRemotes(true);
	const mainRemote = remotes.find(remote => remote.name === 'origin') ?? remotes[0];
	const remoteName = mainRemote.refs.fetch;
	const branchName = await git.revparse(['--abbrev-ref', 'HEAD']);
	return {remoteName, branchName};
};


const pullRepo = async (repoUrl:string):Promise<boolean> => {
	await git.cwd(gitSourcesPath);
	const repoDir = path.join(gitSourcesPath, encodeURIComponent(repoUrl));
	try {
		await fs.access(repoDir);
		await git.cwd(repoDir);
		await logger.log(LogType.Info, `Pulling git repository ${repoUrl}`);
		await git.pull();
		return true;
	} catch (e) {
		try {
			await logger.log(LogType.Info, `Fetching git repository ${repoUrl}`);
			await git.clone(repoUrl, repoDir);
			await git.cwd(repoDir);
			return true;
		} catch (e) {
			await logger.log(LogType.Error, `Could not fetch git repository ${repoUrl}`);
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
		const {remoteName, branchName} = await getRepoBasicInfo();
		const {foundDockerfiles, foundComposeFiles, topFile, topFileContent} = await getRepoDockerInfo();
		if(!topFile){
			return {
				remoteName,
				branchName,
				foundDockerfiles: [],
				foundComposeFiles: [],
				topFile: '',
				topFileContent: ''
			};
		}
		return {
			remoteName,
			branchName,
			foundDockerfiles,
			foundComposeFiles,
			topFile,
			topFileContent
		};
	}catch(e){
		await logger.log(LogType.Error, 'Something went wrong reading repository information');
		return null;
	}
};


export const listRepos = async():Promise<string[]> => {
	await logger.log(LogType.Info, 'Listing git repositories');
	try {
		const dirs = (await fs.readdir(gitSourcesPath, {withFileTypes: true}))
			.filter(d => d.isDirectory())
			.map(d => d.name);
		const repos = [];
		for (const dir of dirs) {
			await git.cwd(path.join(gitSourcesPath, dir));
			const isRepo = await git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);
			if(!isRepo) {
				continue;
			}
			repos.push(dir);
		}
		return repos;
	}catch(e){
		await logger.log(LogType.Error, 'Something went wrong while listing repositories');
		return [];
	}
};
