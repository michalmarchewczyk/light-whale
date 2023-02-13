export const paramsToLink = (current: string, params: Record<string, string>): string => {
	const obj = new URLSearchParams(current);
	Object.entries(params).forEach((param) => {
		obj.set(param[0], param[1]);
	});
	return '?' + obj.toString();
};
