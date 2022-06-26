import type {SimpleGit} from 'simple-git';
import path from 'path';
import linguist from 'linguist-js';
import type {Repo} from '$lib/server/sources/git/Repo.interface';

export default class RepoAnalyzer {
	constructor(private git:SimpleGit) {}

	async getRepoBasicInfo(repoDir:string):Promise<Repo['gitInfo']> {
		const remotes = await this.git.cwd({path:repoDir}).getRemotes(true);
		const mainRemote = remotes.find(remote => remote.name === 'origin') ?? remotes[0];
		const remoteName = mainRemote.refs.fetch;
		const branchName = await this.git.cwd({path:repoDir}).revparse(['--abbrev-ref', 'HEAD']);
		const lastCommitInfo = (await this.git.cwd({path:repoDir}).log({maxCount: 1})).latest;
		const author = `${lastCommitInfo.author_name} <${lastCommitInfo.author_email}>`;
		const lastCommit = lastCommitInfo.message;
		const lastDate = lastCommitInfo.date;
		return {remoteName, branchName, author, lastCommit, lastDate};
	}

	async getRepoDockerInfo(repoDir:string):Promise<Repo['dockerInfo']> {
		const foundDockerfiles = [...(await this.git.cwd({path:repoDir}).grep('FROM')).paths].filter(path => path.endsWith('Dockerfile'));
		const foundComposeFiles = [...(await this.git.cwd({path:repoDir}).grep('services:')).paths].filter(path => path.includes('compose'));
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
		const currentHash = await this.git.cwd({path:repoDir}).revparse(['--short', 'HEAD']);
		const files = [];
		for(const file of [...foundComposeFiles, ...foundDockerfiles]){
			const fileContent = await this.git.cwd({path:repoDir}).show(currentHash + ':' + file);
			let envVars = [];
			if(file.includes('compose')){
				envVars = await RepoAnalyzer.getEnvVariablesFromComposeFile(fileContent);
			}
			files.push({file, content: fileContent, envVars});
		}
		return {foundDockerfiles, foundComposeFiles, topFile, files};
	}

	private static async getEnvVariablesFromComposeFile(fileContent:string):Promise<string[]> {
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
	}

	async getRepoLanguageInfo(repoDir:string):Promise<Repo['languageInfo']> {
		const cwd = await this.git.cwd({path:repoDir}).revparse('--show-toplevel');
		const result = await linguist(cwd, {childLanguages: true, categories: ['programming', 'markup'], quick:true});
		const topLanguages = Object.entries(result.languages.results).sort((a,b) => b[1].bytes - a[1].bytes);
		const topLanguage = topLanguages?.[0] ?? [''];
		return {topLanguage: topLanguage[0], languages: topLanguages.map(l => l[0])};
	}
}
