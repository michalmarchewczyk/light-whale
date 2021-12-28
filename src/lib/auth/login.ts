export const login = (password:string):boolean => {
	const ENV_PASSWORD = process.env.DOCKER_CONTROL_PANEL_PASSWORD ?? '';
	return !(password !== ENV_PASSWORD || ENV_PASSWORD === '');
};
