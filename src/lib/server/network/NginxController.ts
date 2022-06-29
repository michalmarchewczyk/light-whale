import NginxChecker from '$lib/server/network/NginxChecker';
import {logger, LogType} from '$lib/server/utils/Logger';
import {inspectContainer} from '$lib/server/docker/containers';
import {execCommand} from '$lib/server/docker/exec';
import {NGINX_CONTAINER_NAME} from '$lib/server/network/nginxConfig';

export interface NginxStatus {
	running: boolean;
	connected: boolean;
	ports: boolean;
	restartPolicy: boolean;
}

class NginxController {
	private static instance: NginxController;

	private constructor(private nginxChecker:NginxChecker = new NginxChecker()) {}

	public static getInstance(): NginxController {
		if(!NginxController.instance) {
			NginxController.instance = new NginxController();
		}
		return NginxController.instance;
	}

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

export const nginxController = NginxController.getInstance();

export default NginxController;
