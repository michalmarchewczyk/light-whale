export const bytesToHuman = (bytes:number):string => {
	const p = Math.floor(Math.log(bytes + Number.EPSILON) / Math.log(1024));
	return `${(bytes / Math.pow(1024, p)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][p] ?? 'B'}`;
};
