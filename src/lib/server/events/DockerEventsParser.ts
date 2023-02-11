import type { EventMessage } from '$lib/server/types/docker/api';
import type { Event } from '$lib/server/events/EventsController';

export default class DockerEventsParser {
	parseEvent(event: EventMessage): Omit<Event, 'id'> {
		const message = this.getEventMessage(event);
		return {
			time: Number(event.timeNano) / 1000000 || Date.now(),
			type: 'docker',
			title: `Docker:  ${event.Type} / ${event.Action}`,
			message: message
		};
	}

	getEventMessage(event: EventMessage): string {
		if (event.Type === 'container') {
			return this.getContainerMessage(event);
		} else if (event.Type === 'image') {
			return this.getImageMessage(event);
		} else if (event.Type === 'network') {
			return this.getNetworkMessage(event);
		} else if (event.Type === 'volume') {
			return this.getVolumeMessage(event);
		} else if (event.Type === 'daemon') {
			return 'Docker daemon reloaded.';
		} else {
			return `New docker event: ${event.Type}/${event.Action}`;
		}
	}

	getContainerMessage(event: EventMessage): string {
		const containerName = event.Actor?.Attributes?.name || event.Actor?.ID?.substring(0, 12);
		const messages = [
			[`Container ${containerName} started.`, 'start'],
			[`Container ${containerName} stopped.`, 'stop'],
			[`Container ${containerName} killed.`, 'kill'],
			[`Container ${containerName} died.`, 'die'],
			[`Container ${containerName} destroyed.`, 'destroy'],
			[`Container ${containerName} paused.`, 'pause'],
			[`Container ${containerName} unpaused.`, 'unpause'],
			[`Container ${containerName} renamed.`, 'rename'],
			[`Container ${containerName} updated.`, 'update'],
			[`Container ${containerName} created.`, 'create']
		];
		const message = messages.find((m) => m[1] === event.Action);
		return message ? message[0] : `New ${containerName} container event: ${event.Action}`;
	}

	getImageMessage(event: EventMessage): string {
		const imageName = event.Actor?.Attributes?.name || event.Actor?.ID?.substring(0, 12);
		const messages = [
			[`Image ${imageName} pulled.`, 'pull'],
			[`Image ${imageName} pushed.`, 'push'],
			[`Image ${imageName} tagged.`, 'tag'],
			[`Image ${imageName} deleted.`, 'delete'],
			[`Image ${imageName} imported.`, 'import'],
			[`Image ${imageName} loaded.`, 'load'],
			[`Image ${imageName} saved.`, 'save']
		];
		const message = messages.find((m) => m[1] === event.Action);
		return message ? message[0] : `New ${imageName} image event: ${event.Action}`;
	}

	getNetworkMessage(event: EventMessage): string {
		const networkName = event.Actor?.Attributes?.name || event.Actor?.ID?.substring(0, 12);
		const messages = [
			[`Network ${networkName} created.`, 'create'],
			[`Network ${networkName} connected.`, 'connect'],
			[`Network ${networkName} disconnected.`, 'disconnect'],
			[`Network ${networkName} destroyed.`, 'destroy'],
			[`Network ${networkName} removed.`, 'remove'],
			[`Network ${networkName} updated.`, 'update']
		];
		const message = messages.find((m) => m[1] === event.Action);
		return message ? message[0] : `New ${networkName} network event: ${event.Action}`;
	}

	getVolumeMessage(event: EventMessage): string {
		const volumeName = event.Actor?.Attributes?.name || event.Actor?.ID?.substring(0, 12);
		const messages = [
			[`Volume ${volumeName} created.`, 'create'],
			[`Volume ${volumeName} mounted.`, 'mount'],
			[`Volume ${volumeName} unmounted.`, 'unmount'],
			[`Volume ${volumeName} destroyed.`, 'destroy']
		];
		const message = messages.find((m) => m[1] === event.Action);
		return message ? message[0] : `New ${volumeName} volume event: ${event.Action}`;
	}
}
