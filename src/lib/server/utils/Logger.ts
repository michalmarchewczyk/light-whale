import type FilesManager from '$lib/server/utils/FilesManager';
import { filesManager } from '$lib/server/utils/FilesManager';

export enum LogType {
	Info = 'Info',
	Warning = 'Warning',
	Error = 'Error',
	Verbose = 'Verbose'
}

export interface Log {
	type: LogType;
	msg: string;
	date: Date;
}

class Logger {
	private static instance: Logger;
	private filePath = '';
	private logs: Log[] = [];
	private lastTime = 0;

	public static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger(filesManager);
		}

		return Logger.instance;
	}

	private constructor(private filesManager: FilesManager) {
		const date = new Date()
			.toISOString()
			.replaceAll('-', '')
			.replaceAll('T', '_')
			.replaceAll(':', '')
			.replaceAll('.', '');
		this.filePath = `logs/${date}.log`;
		this.filesManager.writeFile(this.filePath, '===== LOGS START =====\n').then(async () => {
			this.lastTime = Date.now();
			await this.log(LogType.Info, 'Logger initialized');
		});
	}

	public log(type: LogType, msg: string): void {
		this.logs = this.logs.slice(-100000);
		const date = new Date();
		let dateDiff = 0;
		if (type !== LogType.Verbose) {
			dateDiff = date.getTime() - this.lastTime;
			this.lastTime = date.getTime();
		}
		this.logs.push({ type, msg, date });
		const log = `[${date.toISOString()}][+${dateDiff / 1000}] (${type}) ${msg}`;
		this.filesManager.writeFile(this.filePath, log + '\n').then(() => {
			if (type === LogType.Verbose) {
				return;
			}
			// eslint-disable-next-line no-console
			console.log('LW-Logger:', log);
		});
	}

	public logInfo(msg: string): void {
		this.log(LogType.Info, msg);
	}

	public logWarning(msg: string): void {
		this.log(LogType.Warning, msg);
	}

	public logError(msg: string): void {
		this.log(LogType.Error, msg);
	}

	public logVerbose(msg: string): void {
		this.log(LogType.Verbose, msg);
	}

	public get(): Log[] {
		return this.logs;
	}
}

export const logger = Logger.getInstance();
