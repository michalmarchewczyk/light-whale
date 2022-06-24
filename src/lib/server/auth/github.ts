import type {Token} from '$lib/server/auth/tokens';

export const getGithubTokensInfo = async (tokens:Token[]) => {
	const results = [];
	for(const token of tokens){
		const res = await fetch('https://api.github.com/user', {
			method: 'GET',
			headers: {'Authorization': `token ${token.token}`},
		});
		if(res.status !== 200){
			continue;
		}
		const data = await res.json();
		results.push({
			id: token.id,
			date: token.date,
			description: token.description,
			login: data.login,
			name: data.name,
			avatarUrl: data.avatar_url,
			url: data.html_url,
		});
	}
	return results;
};
