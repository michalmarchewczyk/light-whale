import {dockerUrl} from '$lib/docker/config';

interface Container {
	id:string,
	names:string[],
	imageName:string,
	imageId:string,
	created:Date,
	state:string,
	status:string,
}

export const getContainers = async ():Promise<Container[]> => {
	const res = await fetch(dockerUrl+'/containers/json?all=true&size=true');
	const data = await res.json();
	const containers:Container[] = data.map((container):Container => ({
		id: container.Id ?? '',
		names: container.Names ?? [],
		imageName: container.Image ?? '',
		imageId: container.ImageID ?? '',
		created: new Date(container.Created*1000 ?? 0),
		state: container.State ?? '',
		status: container.Status ?? 4
	}));
	return containers;
};
