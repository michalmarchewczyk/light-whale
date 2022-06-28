import {logger, LogType} from '$lib/server/utils/Logger';
import process from 'process';
import {exec} from 'child_process';
import SetupChecker from '$lib/server/setup/SetupChecker';
import {authController} from '$lib/server/auth/AuthController';
import SetupNginxController from '$lib/server/setup/SetupNginxController';

export type SetupError = 'no-docker' | 'no-ping' | 'no-container' | 'no-image' | 'no-network' | 'no-paths';

export interface SetupStatus {
	systemInfo: {
		os: string;
	},
	stage: 'no-docker' | 'no-nginx' | 'no-password' | 'done';
	errors: SetupError[];
	working: boolean;
}

class SetupController {
	private static instance: SetupController;
	private currentStatus: SetupStatus;

	private constructor(private setupChecker:SetupChecker, private setupNginxController:SetupNginxController) {
		this.currentStatus = {
			systemInfo: {
				os: '',
			},
			stage: 'no-docker',
			errors: [],
			working: false,
		};
	}

	public static getInstance(): SetupController {
		if (!SetupController.instance) {
			SetupController.instance = new SetupController(
				new SetupChecker(),
				new SetupNginxController()
			);
		}
		return SetupController.instance;
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

	public async setupPassword(password:string){
		this.currentStatus.working = true;
		await authController.setPassword(password);
		this.currentStatus.working = false;
	}
}

export const setupController = SetupController.getInstance();

export default SetupController;
