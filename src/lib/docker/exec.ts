import {DOCKER_URL} from '$lib/docker/config';


export const execCommand = async (containerId:string, command:string):Promise<string | null> => {
	const resCreate = await fetch(DOCKER_URL + `/containers/${containerId}/exec`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			'AttachStdin': true,
			'AttachStdout': true,
			'AttachStderr': true,
			'Tty': true,
			'Cmd': [...command.split(' ')],
		}),
	});
	if (resCreate.status !== 201) {
		return null;
	}
	const dataCreate = await resCreate.json();
	const execId = dataCreate.Id;
	const resStart = await fetch(DOCKER_URL + `/exec/${execId}/start`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			'Detach': false,
			'Tty': true,
		}),
	});
	if (resStart.status !== 200) {
		return null;
	}
	return await resStart.text();
};
