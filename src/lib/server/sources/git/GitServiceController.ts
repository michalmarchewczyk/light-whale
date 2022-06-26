export interface RemoteToken {
	id:string;
	date:Date;
	description:string;
	login:string,
}

export interface RemoteRepo {
	service:string;
	remoteName:string,
	branchName:string,
	author:string,
}

export interface GitServiceController {
	getTokensInfo():Promise<RemoteToken[]>;
	listRepos():Promise<RemoteRepo[]>;
}
