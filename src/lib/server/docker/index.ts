import DockerController from '$lib/server/docker/DockerController';
import NginxManager from '$lib/server/docker/NginxManager';

export const dockerController = new DockerController();

export const nginxManager = new NginxManager();
