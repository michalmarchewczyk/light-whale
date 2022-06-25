import type {Token} from '$lib/server/auth/tokens';

export const getGithubTokensInfo = async (tokens:Token[]) => {
	let results:Token[] = [];
	results = (await Promise.all(tokens.map(async (token) => {
		const res = await fetch('https://api.github.com/user', {
			method: 'GET',
			headers: {'Authorization': `token ${token.token}`},
		});
		if(res.status !== 200){
			return [];
		}
		const data = await res.json();
		return {
			id: token.id,
			date: token.date,
			description: token.description,
			login: data.login,
			name: data.name,
			avatarUrl: data.avatar_url,
			url: data.html_url,
		};
	}))).flat();
	return results;
};
