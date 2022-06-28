import fs from 'fs/promises';
import path from 'path';

export enum LogType {
	Info = 'Info',
	Warning = 'Warning',
	Error = 'Error',
	Router = 'Router',
	Client = 'Client',
	Verbose = 'Verbose',
}

export interface Log {
	type:LogType;
	msg:string;
	date:Date;
}

class Logger {
	private static instance:Logger;
	private file:string;
	private logs:Log[] = [];
	private lastTime = 0;

	public static getInstance():Logger {
		if(!Logger.instance){
			Logger.instance = new Logger();
		}

		return Logger.instance;
	}

	private constructor(){
		const logsFolder = path.join(process.cwd(), 'lw-logs');
		fs.mkdir(logsFolder, {recursive: true}).then(async () => {
			const date = new Date().toISOString()
				.replaceAll('-', '')
				.replaceAll('T', '_')
				.replaceAll(':', '')
				.replaceAll('.', '');
			this.file = path.join(logsFolder, `logs_${date}.txt`);
			await fs.writeFile(this.file, '===== LOGS START =====\n', {encoding: 'utf-8', flag: 'w'});
			this.lastTime = Date.now();
			await this.log(LogType.Info, 'Logger initialized');
		});
	}

	log(type:LogType, msg:string):void{
		this.logs = this.logs.slice(-100000);
		const date = new Date();
		let dateDiff = 0;
		if(type !== LogType.Verbose) {
			dateDiff = date.getTime() - this.lastTime;
			this.lastTime = date.getTime();
		}
		this.logs.push({type, msg, date});
		const log = `[${date.toISOString()}][+${dateDiff/1000}] (${type}) ${msg}`;
		fs.writeFile(this.file, log+'\n', {encoding: 'utf-8', flag: 'a'}).then(() => {
			if (type === LogType.Router || type === LogType.Verbose){
				return;
			}
			// eslint-disable-next-line no-console
			console.log('LW-Logger:', log);
		});
	}

	get():Log[]{
		return this.logs;
	}
}

export const logger = Logger.getInstance();

export default Logger;
