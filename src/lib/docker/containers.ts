import {dockerUrl} from '$lib/docker/config';

interface Container {
	id:string,
	names:string[],
	imageName:string,
	imageId:string,
	command:string,
	created:Date,
	state:string,
	status:string,
	compose:string|null,
}

export const getContainers = async ():Promise<Container[]> => {
	const res = await fetch(dockerUrl+'/containers/json?all=true&size=true');
	const data = await res.json();
	const containers:Container[] = data.map((container):Container => ({
		id: container.Id ?? '',
		names: container.Names ?? [],
		imageName: container.Image ?? '',
		imageId: container.ImageID ?? '',
		command: container.Command ?? '',
		created: new Date(container.Created*1000 ?? 0),
		state: container.State ?? '',
		status: container.Status ?? 4,
		compose: container.Labels['com.docker.compose.project'] ?? null,
	}));
	return containers;
};
