import path from 'path';
import fs from 'fs/promises';
import type {SimpleGit, SimpleGitOptions} from 'simple-git';
import simpleGit from 'simple-git';
import {logger, LogType} from '$lib/server/utils/Logger';
import linguist from 'linguist-js';
import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/server/docker/config';
import {exec} from 'child_process';
import validator from 'validator';
import YAML from 'yaml';
import type {ComposeSpecification} from '$lib/server/typings/docker/ComposeFile';

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
	files: {
		file:string,
		content:string,
		envVars:string[]
	}[],
	topLanguage:string,
	languages:string[],
}

type RepoBasicInfo = Pick<RepoInfo, 'remoteName' | 'branchName' | 'author' | 'lastCommit' | 'lastDate'>;

type RepoDockerInfo = Pick<RepoInfo, 'foundDockerfiles' | 'foundComposeFiles' | 'topFile' | 'files' >;


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
	const foundComposeFiles = [...(await git.grep('services:')).paths].filter(path => path.includes('compose'));
	if(foundDockerfiles.length === 0 && foundComposeFiles.length === 0){
		return {foundDockerfiles, foundComposeFiles, topFile: '', files: []};
	}
	let topFile = foundComposeFiles
		.filter(path => path.endsWith('docker-compose.yaml') || path.endsWith('docker-compose.yml'))
		.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length)
		?.[0];
	topFile = topFile ?? foundComposeFiles
		.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length)
		?.[0];
	topFile = topFile ?? foundDockerfiles
		.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length)
		?.[0];
	const currentHash = await git.revparse(['--short', 'HEAD']);
	const files = [];
	for(const file of [...foundComposeFiles, ...foundDockerfiles]){
		const fileContent = await git.show(currentHash + ':' + file);
		let envVars = [];
		if(file.includes('compose')){
			envVars = await getEnvVariablesFromComposeFile(fileContent);
		}
		files.push({file, content: fileContent, envVars});
	}
	return {foundDockerfiles, foundComposeFiles, topFile, files};

};

const getEnvVariablesFromComposeFile = async(fileContent:string):Promise<string[]> => {
	let found = [];
	const regex = /(\${\w+:?-?\??\w+})|(\$\w+)/gm;
	fileContent.split('\n').forEach(line => {
		let stringToTest = line;
		while(regex.test(stringToTest)){
			const res = stringToTest.match(regex);
			res.forEach(r => {
				if(!r.startsWith('$$')) {
					found.push(r);
				}
			});
			stringToTest = stringToTest.replaceAll(regex, '');
		}
	});
	found = found.map(r => r[1] === '{' ? r.slice(2,r.length-1) : r.slice(1));
	found = found.map(r => r.split('-')[0].split(':')[0].split('?')[0]);
	found = [...new Set(found)];
	return found;
};

const getRepoSourceInfo = async():Promise<{ topLanguage: string, languages: string[] }> => {
	const cwd = await git.revparse('--show-toplevel');
	const result = await linguist(cwd, {childLanguages: true, categories: ['programming', 'markup'], quick:true});
	const topLanguages = Object.entries(result.languages.results).sort((a,b) => b[1].bytes - a[1].bytes);
	const topLanguage = topLanguages?.[0] ?? [''];
	return {topLanguage: topLanguage[0], languages: topLanguages.map(l => l[0])};
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
		const {topLanguage, languages} = await getRepoSourceInfo();
		const repoInfo:RepoInfo = {
			...basicInfo,
			...dockerInfo,
			topLanguage,
			languages
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


export const buildRepo = async (repoUrl:string, name:string, selectedFile:string, envVariables:Record<string, string>):Promise<string> => {
	if(!validator.isAlphanumeric(name, 'en-US', {ignore: '-'}) || !validator.isURL(selectedFile, {
		require_tld: false,
		require_valid_protocol: false,
		require_host: false,
	})) {
		return '';
	}
	await logger.log(LogType.Info, `Building repo: ${repoUrl}`);
	const data = await fs.readFile(path.join(gitSourcesPath, encodeURIComponent(repoUrl)+'.json'), {encoding: 'utf-8'});
	const repoInfo:RepoInfo = JSON.parse(data);
	const file = repoInfo.files.find(f => f.file === selectedFile);
	if(!file){
		return '';
	}
	if(file.envVars.join(' ') !== Object.keys(envVariables).join(' ')){
		return '';
	}
	if(selectedFile.includes('Dockerfile')){
		const imageId = await buildFromDockerfile(repoInfo, name, selectedFile);
		return imageId;
	}else{
		await buildFromComposeFile(repoInfo, name, selectedFile, envVariables);
		return '';
	}
};

const buildFromDockerfile = async (repoInfo:RepoInfo, name:string, selectedFile: string):Promise<string> => {
	await logger.log(LogType.Info, `Building image with name: ${name}`);
	const res = await fetch(DOCKER_URL + `/build?dockerfile=${selectedFile}&t=${name}&remote=${repoInfo.remoteName}&q=true`, {
		method: 'POST',
	});
	if(res.status !== 200){
		return '';
	}
	const imageId = (await res.json()).stream;
	await logger.log(LogType.Info, `Built image with ID: ${imageId}`);
	return imageId;
};

const buildFromComposeFile = async (repoInfo:RepoInfo, name:string, selectedFile: string, envVariables:Record<string, string>):Promise<string> => {
	await logger.log(LogType.Info, `Building app with name: ${name}`);
	const config:ComposeSpecification = YAML.parse(repoInfo.files.find(file => file.file === selectedFile)?.content);
	Object.values(config.services).forEach((service) => {
		if(service.ports){
			service.ports = [];
		}
		if(!service.networks){
			service.networks = [];
		}
		if(Array.isArray(service.networks)){
			service.networks.push(LW_NETWORK_NAME);
		}else{
			service.networks[LW_NETWORK_NAME] = {};
		}
	});
	if(!config.networks){
		config.networks = {[LW_NETWORK_NAME]: {external: true}};
	}else{
		config.networks[LW_NETWORK_NAME] = {external: true};
	}

	const tempConfigPath = path.join(gitSourcesPath, encodeURIComponent(repoInfo.remoteName), selectedFile+'.temp');
	await fs.writeFile(tempConfigPath, YAML.stringify(config));
	await new Promise((resolve) => {
		// TODO: replace with execFile
		exec(`docker compose -f ${tempConfigPath} -p ${name} up --no-start --build --force-recreate`, {env: {...process.env, ...envVariables}}, (err) => {
			if(err){
				resolve(false);
			}
			resolve(true);
		});
	});
	await fs.rm(tempConfigPath);
	return name;
};
