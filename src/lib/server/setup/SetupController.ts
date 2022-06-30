import {logger, LogType} from '$lib/server/utils/Logger';
import process from 'process';
import {exec} from 'child_process';
import type SetupChecker from '$lib/server/setup/SetupChecker';
import type SetupNginxController from '$lib/server/setup/SetupNginxController';
import {authController, tokenManager} from '$lib/server/auth';
import type {SetupStatus} from '$lib/server/setup/SetupStatus';

export default class SetupController {
	private currentStatus: SetupStatus;
	private githubToken:{token:string, description:string} | undefined;

	constructor(private setupChecker:SetupChecker, private setupNginxController:SetupNginxController) {
		this.currentStatus = {
			systemInfo: {
				os: '',
			},
			stage: 'no-docker',
			errors: [],
			working: false,
		};
	}

	private async getSystemInfo():Promise<SetupStatus['systemInfo']> {
		logger.log(LogType.Info, 'Reading System Info');
		const os:string = await new Promise((resolve) => {
			if(process.platform === 'win32'){
				resolve('Windows');
				return;
			}
			if(process.platform === 'darwin'){
				resolve('macOS');
				return;
			}
			if(process.platform !== 'linux'){
				resolve('unknown');
				return;
			}
			exec('cat /etc/*release | grep -E ^NAME', (error, stdout, stderr) => {
				if(error || stderr){
					resolve('unknown');
					return;
				}
				const name = stdout.trim().split('=')[1].trim();
				resolve(name);
			});
		});
		return {
			os
		};
	}

	public async getCurrentStatus():Promise<SetupStatus> {
		const check = await this.setupChecker.check();
		this.currentStatus = {
			systemInfo: await this.getSystemInfo(),
			stage: check.stage,
			errors: check.errors,
			working: false,
		};
		return this.currentStatus;
	}

	public async setupNginx(){
		this.currentStatus.working = true;
		await this.setupNginxController.setup();
		this.currentStatus.working = false;
	}

	public setGithubToken(token:string, description:string){
		this.githubToken = {
			token,
			description,
		};
	}

	public async setupPassword(password:string){
		this.currentStatus.working = true;
		await authController.setPassword(password);
		if(this.githubToken){
			await tokenManager.addToken(this.githubToken.token, password, 'github', this.githubToken.description);
			this.githubToken = undefined;
		}
		this.currentStatus.working = false;
	}
}
