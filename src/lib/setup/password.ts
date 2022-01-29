import path from 'path';
import fs from 'fs/promises';

const passwordPath = path.join(process.cwd(), 'lw-config', 'password.txt');

export const getPassword = async ():Promise<string> => {
	return await fs.readFile(passwordPath, {encoding: 'utf-8'}).catch(() => '') ?? '';
};

export const setPassword = async (password:string):Promise<boolean> => {
	await fs.writeFile(passwordPath, password, {encoding: 'utf-8'});
	return true;
};
