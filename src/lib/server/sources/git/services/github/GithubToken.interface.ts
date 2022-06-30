import type {GitServiceToken} from '$lib/server/sources/git/services/GitServiceToken.interface';

export interface GithubToken extends GitServiceToken {
    id:string;
    date:Date;
    description:string;
    login:string,
    name:string,
    avatarUrl:string,
    url:string,
}
