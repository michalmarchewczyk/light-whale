import {DOCKER_URL} from '$lib/server/docker/config';
import {logger, LogType} from '$lib/server/utils/Logger';


export const execCommand = async (containerId:string, command:string):Promise<string | null> => {
	logger.log(LogType.Info, `Execute command: ${command} on container with id: ${containerId}`);
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
