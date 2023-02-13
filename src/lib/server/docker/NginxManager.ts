import { DOCKER_URL, LW_NETWORK_NAME } from '$lib/server/config';
import { logger } from '$lib/server/utils/Logger';

export default class NginxManager {
	constructor() {
		logger.logVerbose('NginxManager initialized');
	}
	public async checkLwNetwork(): Promise<boolean> {
		try {
			const res = await fetch(`${DOCKER_URL}/networks/${LW_NETWORK_NAME}`);
			return res.status === 200;
		} catch (e) {
			return false;
		}
	}

	public async createLwNetwork(): Promise<boolean> {
		logger.logInfo('Creating LW network');
		const res = await fetch(`${DOCKER_URL}/networks/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				Name: LW_NETWORK_NAME,
				CheckDuplicate: true,
				Attachable: true
			})
		});
		if (res.status !== 201 && res.status !== 409) {
			logger.logError(`Failed to create LW network: ${res.status}`);
		}
		return !(res.status !== 201 && res.status !== 409);
	}
}
