import { DOCKER_URL } from '$lib/server/config';
import { exec } from 'child_process';

export default class DockerController {
	public async ping(): Promise<boolean> {
		try {
			const res = await fetch(`${DOCKER_URL}/_ping`);
			return res.status === 200;
		} catch (e) {
			return false;
		}
	}

	public async checkDockerVersion(): Promise<string> {
		return await new Promise((resolve, reject) => {
			exec('docker version', (err, stdout, stderr) => {
				if (err || stderr) {
					reject(err);
				} else {
					resolve(stdout);
				}
			});
		});
	}
}
