import type NginxChecker from '$lib/server/network/NginxChecker';
import {logger, LogType} from '$lib/server/utils/Logger';
import {NGINX_CONTAINER_NAME} from '$lib/server/setup/config';
import type {NginxStatus} from '$lib/server/network/NginxStatus.interface';
import {containersController} from '$lib/server/docker';

export default class NginxController {
	constructor(private nginxChecker:NginxChecker) {}

	public async check():Promise<NginxStatus> {
		return await this.nginxChecker.check();
	}

	public async reload():Promise<boolean>{
		logger.log(LogType.Info, 'Reloading LW container');
		const container = await containersController.getContainerByName(NGINX_CONTAINER_NAME);
		const containerData = await container?.inspect();
		if (!containerData['Id'] || containerData?.['State']?.['Status'] !== 'running') {
			return false;
		}
		await container.exec('nginx -s reload');
		return true;
	}
}
