import type {Status} from '$lib/server/check/Status.interface';
import type NginxChecker from '$lib/server/network/NginxChecker';
import {setupController} from '$lib/server/setup';

export default class StatusChecker {
	constructor(private nginxChecker:NginxChecker) {}

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
