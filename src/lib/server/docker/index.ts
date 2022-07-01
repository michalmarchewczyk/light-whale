import DockerController from '$lib/server/docker/DockerController';
import ContainersController from '$lib/server/docker/ContainersController';
import ContainerFilesReader from '$lib/server/docker/ContainerFilesReader';
import ImagesController from '$lib/server/docker/ImagesController';

export const dockerController = new DockerController();

const containerFilesReader = new ContainerFilesReader();

export const containersController = new ContainersController(containerFilesReader);

export const imagesController = new ImagesController();
