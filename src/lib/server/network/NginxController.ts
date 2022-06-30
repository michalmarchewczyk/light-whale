import type NginxChecker from '$lib/server/network/NginxChecker';
import {logger, LogType} from '$lib/server/utils/Logger';
import {inspectContainer} from '$lib/server/docker/containers';
import {execCommand} from '$lib/server/docker/exec';
import {NGINX_CONTAINER_NAME} from '$lib/server/setup/config';
import type {NginxStatus} from '$lib/server/network/NginxStatus.interface';

export default class NginxController {
	constructor(private nginxChecker:NginxChecker) {}

	public async check():Promise<NginxStatus> {
		return await this.nginxChecker.check();
	}

	public async reload():Promise<boolean>{
		logger.log(LogType.Info, 'Reloading LW container');
		const container = await inspectContainer(NGINX_CONTAINER_NAME);
		if (!container['Id'] || container?.['State']?.['Status'] !== 'running') {
			return false;
		}
		await execCommand(container['Id'], 'nginx -s reload');
		return true;
	}
}
