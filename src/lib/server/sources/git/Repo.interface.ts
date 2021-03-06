export interface Repo {
    service:string,
	tokenId?:string,
    gitInfo:{
        remoteName:string,
        branchName:string,
        author:string,
        lastCommit:string,
        lastDate:string,
    },
    dockerInfo:{
        foundDockerfiles:string[],
        foundComposeFiles:string[],
        topFile:string,
        files:{
            file:string,
            content:string,
            envVars:string[]
        }[],
    },
    languageInfo:{
        topLanguage:string,
        languages:string[],
    }
}
