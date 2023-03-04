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

	private async accessFile(filePath: string, flag = 'a+'): Promise<fs.FileHandle> {
		const absPath = path.join(this.lwDirPath, filePath);
		await fs.mkdir(path.dirname(absPath), { recursive: true });
		await fs.writeFile(absPath, '', { flag: 'a', encoding: 'utf-8' });
		return fs.open(absPath, flag);
	}

	private async accessDir(dirPath: string) {
		const absPath = path.join(this.lwDirPath, dirPath);
		await fs.mkdir(absPath, { recursive: true });
		return fs.opendir(absPath);
	}

	async readFile(filePath: string): Promise<string> {
		const file = await this.accessFile(filePath);
		const data = await file.readFile({ encoding: 'utf-8' });
		await file.close();
		return data.toString();
	}

	async writeFile(filePath: string, data: string, clear = false): Promise<void> {
		const file = await this.accessFile(filePath, clear ? 'w+' : 'a+');
		await file.writeFile(data, { encoding: 'utf-8' });
		await file.close();
	}

	async removeFile(filePath: string): Promise<void> {
		const file = await this.accessFile(filePath);
		await file.close();
		await fs.unlink(path.join(this.lwDirPath, filePath));
	}

	async readDir(dirPath: string): Promise<string[]> {
		const dir = await this.accessDir(dirPath);
		const files: string[] = [];
		for await (const dirent of dir) {
			files.push(dirent.name);
		}
		return files;
	}

	async readDirFiles(dirPath: string): Promise<string[]> {
		const files = await this.accessDir(dirPath);
		const fileNames: string[] = [];
		for await (const dirent of files) {
			if (dirent.isFile()) {
				fileNames.push(dirent.name);
			}
		}
		return await Promise.all(fileNames.map((file) => this.readFile(path.join(dirPath, file))));
	}

	async getAbsPath(filePath: string): Promise<string> {
		const isDir = (await fs.stat(path.join(this.lwDirPath, filePath))).isDirectory();
		if (isDir) {
			const dir = await this.accessDir(filePath);
			await dir.close();
			return path.join(this.lwDirPath, filePath);
		}
		const file = await this.accessFile(filePath);
		await file.close();
		return path.join(this.lwDirPath, filePath);
	}

	async getFileStat(filePath: string) {
		const file = await this.accessFile(filePath);
		const stat = await file.stat();
		await file.close();
		return stat;
	}
}

export const filesManager = FilesManager.getInstance();
