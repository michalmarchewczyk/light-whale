import type {SetupStatus} from '$lib/server/setup/SetupController';
import {logger, LogType} from '$lib/server/utils/Logger';
import {exec} from 'child_process';
import {DOCKER_URL} from '$lib/server/docker/config';
import SetupNginxChecker from '$lib/server/setup/SetupNginxChecker';
import {authController} from '$lib/server/auth/AuthController';

class SetupChecker {
	constructor(private setupNginxChecker:SetupNginxChecker = new SetupNginxChecker()) {}

	public async check():Promise<Pick<SetupStatus, 'stage' | 'errors'>> {
		let stage:SetupStatus['stage'] = null;
		if(await this.isPasswordSet()) {
			stage = 'done';
		}
		const errors = [];
		if(!await this.isDockerInstalled()){
			stage = stage ?? 'no-docker';
			errors.push('no-docker');
		}
		if(!await this.isDockerPingable()){
			stage = stage ?? 'no-docker';
			errors.push('no-ping');
		}
		const nginxErrors = await this.setupNginxChecker.check();
		if(nginxErrors.length > 0){
			stage = stage ?? 'no-nginx';
			errors.push(...nginxErrors);
		}
		if(!await this.isPasswordSet()){
			stage = stage ?? 'no-password';
			errors.push('no-password');
		}

		stage = stage ?? 'done';
		return {
			stage,
			errors,
		};
	}

	private async isDockerInstalled():Promise<boolean> {
		logger.log(LogType.Verbose, 'Checking if Docker is installed');
		return await new Promise((resolve) => {
			exec('docker version', function(error, stdout, stderr) {
				if(error || stderr){
					logger.log(LogType.Error, 'Could not find Docker');
					resolve(false);
					return;
				}
				resolve(true);
			});
		});
	}

	private async isDockerPingable():Promise<boolean> {
		try {
			logger.log(LogType.Verbose, 'Pinging Docker');
			const res = await fetch(DOCKER_URL + '/_ping');
			return res.status === 200;
		} catch (e) {
			return false;
		}
	}

	private async isPasswordSet():Promise<boolean> {
		return authController.isPasswordSet();
	}
}

export default SetupChecker;
