import fs from 'fs/promises';
import path from 'path';

export enum LogType {
	Info = 'Info',
	Warning = 'Warning',
	Error = 'Error',
	Router = 'Router',
	Client = 'Client'
}

export interface Log {
	type:LogType;
	msg:string;
}

class Logger {
	private static instance:Logger;
	private readonly file:string;
	private logs:Log[] = [];

	public static getInstance():Logger {
		if(!Logger.instance){
			Logger.instance = new Logger();
		}

		return Logger.instance;
	}

	private constructor(){
		const logsFolder = path.join(process.cwd(), 'lw-logs');
		const date = new Date().toISOString()
			.replaceAll('-', '')
			.replaceAll('T', '_')
			.replaceAll(':', '')
			.replaceAll('.', '');
		this.file = path.join(logsFolder, `logs_${date}.txt`);
		fs.writeFile(this.file, '===== LOGS START =====\n', {encoding: 'utf-8', flag: 'w'})
			.then(async() => {
				await this.log(LogType.Info, 'Logger initialized');
			});
	}

	async log(type:LogType, msg:string):Promise<void>{
		this.logs = this.logs.slice(-10000);
		this.logs.push({type, msg});
		const log = `[${type}] ${msg}\n`;
		// eslint-disable-next-line no-console
		console.log('LW-Logger:', log);
		await fs.writeFile(this.file, log, {encoding: 'utf-8', flag: 'a'});
	}

	get():Log[]{
		return this.logs;
	}
}

export default Logger;
