export default interface GitServiceRepo {
	service: string;
	remoteUrl: string;
	branchName: string;
	owner: string;
	lastCommitDate: string;
	topLanguage: string;
	languages: string[];
	visibility: string;
	tokenId: string;
}
