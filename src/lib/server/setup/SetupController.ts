import {logger, LogType} from '$lib/server/utils/Logger';
import type SetupChecker from '$lib/server/setup/SetupChecker';
import type SetupNginxController from '$lib/server/setup/SetupNginxController';
import {authController, tokenManager} from '$lib/server/auth';
import type {SetupStatus} from '$lib/server/setup/SetupStatus';
import os from 'os';
import {bytesToHuman} from '$lib/server/utils/bytesToHuman';

export default class SetupController {
	private currentStatus: SetupStatus;
	private githubToken:{token:string, description:string} | undefined;

	constructor(private setupChecker:SetupChecker, private setupNginxController:SetupNginxController) {
		this.currentStatus = {
			systemInfo: {
				os: '',
				cpu: '',
				memory: '',
				hostname: '',
			},
			stage: 'no-docker',
			errors: [],
			working: false,
		};
	}

	private async getSystemInfo():Promise<SetupStatus['systemInfo']> {
		logger.log(LogType.Info, 'Reading System Info');
		const memory = bytesToHuman(os.totalmem() - os.freemem()) + '/' + bytesToHuman(os.totalmem());
		return {
			os: os.type() + ' (' + os.version() + ')',
			cpu: os.cpus()[0].model,
			memory,
			hostname: os.hostname(),
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
