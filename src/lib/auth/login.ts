export const login = (password:string):boolean => {
	const ENV_PASSWORD = process.env.LIGHT_WHALE_PASSWORD ?? '';
	return !(password !== ENV_PASSWORD || ENV_PASSWORD === '');
};
