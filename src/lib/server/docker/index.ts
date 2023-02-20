import DockerController from '$lib/server/docker/DockerController';
import NginxManager from '$lib/server/docker/NginxManager';
import ContainersManager from '$lib/server/docker/ContainersManager';
import ContainerFilesReader from '$lib/server/docker/ContainerFilesReader';
import ImagesManager from '$lib/server/docker/ImagesManager';
import { filesManager } from '$lib/server/utils/FilesManager';

export const containersManager = new ContainersManager();

export const containerFilesReader = new ContainerFilesReader();

export const imagesManager = new ImagesManager();

export const dockerController = new DockerController();

export const nginxManager = new NginxManager(containersManager, imagesManager, filesManager);
