import DockerController from '$lib/server/docker/DockerController';
import NginxManager from '$lib/server/docker/NginxManager';
import ContainersManager from '$lib/server/docker/ContainersManager';

export const containersManager = new ContainersManager();

export const dockerController = new DockerController();

export const nginxManager = new NginxManager();
