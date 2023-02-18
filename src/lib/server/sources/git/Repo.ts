export default interface Repo {
	service: string;
	gitInfo: {
		remoteUrl: string;
		branchName: string;
		owner: string;
		lastCommit: string;
		lastCommitDate: string;
	};
	dockerInfo: {
		foundDockerfiles: string[];
		foundComposeFiles: string[];
		topFile: string;
		files: {
			file: string;
			content: string;
			envVars: string[];
		}[];
	};
	languageInfo: {
		topLanguage: string;
		languages: string[];
	};
}
