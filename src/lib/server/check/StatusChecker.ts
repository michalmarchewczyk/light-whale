import type {Status} from '$lib/server/check/Status.interface';
import NginxChecker from '$lib/server/network/NginxChecker';
import {setupController} from '$lib/server/setup/SetupController';

class StatusChecker {
	private static instance: StatusChecker;

	private constructor(private nginxChecker:NginxChecker = new NginxChecker()) {}

	public static getInstance(): StatusChecker {
		if(!StatusChecker.instance) {
			StatusChecker.instance = new StatusChecker();
		}
		return StatusChecker.instance;
	}

	public async check():Promise<Status> {
		const setupStatus = await setupController.getCurrentStatus();
		const nginxStatus = await this.nginxChecker.check();
		return {
			dockerRunning: !setupStatus.errors.includes('no-docker'),
			dockerPinging: !setupStatus.errors.includes('no-ping'),
			network: !setupStatus.errors.includes('no-network'),
			...nginxStatus,
		};
	}
}

export const statusChecker = StatusChecker.getInstance();

export default StatusChecker;
