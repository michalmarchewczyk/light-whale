import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { LW_DIRNAME } from '$lib/server/config';

export default class FilesManager {
	private static instance: FilesManager;
	private readonly lwDirPath: string;

	static getInstance(): FilesManager {
		if (!FilesManager.instance) {
			FilesManager.instance = new FilesManager();
		}
		return FilesManager.instance;
	}

	private constructor() {
		this.lwDirPath = path.join(process.cwd(), LW_DIRNAME);
		this.init();
	}

	private async init() {
		await fs.mkdir(this.lwDirPath, { recursive: true });
	}

	private async accessFile(filePath: string): Promise<fs.FileHandle> {
		const absPath = path.join(this.lwDirPath, filePath);
		await fs.mkdir(path.dirname(absPath), { recursive: true });
		await fs.writeFile(absPath, '', { flag: 'a' });
		return fs.open(absPath, 'a+');
	}

	async readFile(filePath: string): Promise<string> {
		const file = await this.accessFile(filePath);
		const data = await file.readFile();
		await file.close();
		return data.toString();
	}

	async writeFile(filePath: string, data: string): Promise<void> {
		const file = await this.accessFile(filePath);
		await file.writeFile(data);
		await file.close();
	}
}

export const filesManager = FilesManager.getInstance();
