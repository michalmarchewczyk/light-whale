import type {GitServiceRepo} from '$lib/server/sources/git/services/GitServiceRepo.interface';

export interface GithubRepo extends GitServiceRepo {
    service:string;
    remoteName:string;
    branchName:string;
    author:string;
    lastDate:string;
    topLanguage:string;
    languages:string;
}
