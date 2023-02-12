import { DOCKER_URL, LW_NETWORK_NAME } from '$lib/server/config';

export default class NginxManager {
	public async checkLwNetwork(): Promise<boolean> {
		try {
			const res = await fetch(`${DOCKER_URL}/networks/${LW_NETWORK_NAME}`);
			return res.status === 200;
		} catch (e) {
			return false;
		}
	}

	public async createLwNetwork(): Promise<boolean> {
		const res = await fetch(`${DOCKER_URL}/networks/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				Name: LW_NETWORK_NAME,
				CheckDuplicate: true,
				Attachable: true
			})
		});
		return !(res.status !== 201 && res.status !== 409);
	}
}
