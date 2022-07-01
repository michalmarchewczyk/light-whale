import {logger, LogType} from '$lib/server/utils/Logger';
import {DOCKER_URL} from '$lib/server/docker/config';

export default class DockerController {
	private lastEvent:string|null = null;

	public async ping():Promise<boolean> {
		try {
			logger.log(LogType.Verbose, 'Pinging Docker');
			const res = await fetch(DOCKER_URL + '/_ping');
			return res.status === 200;
		} catch (e) {
			return false;
		}
	}

	public async getEvents(){
		try {
			logger.log(LogType.Verbose, 'Retrieving Docker events');
			const serverTimeRes = await fetch(DOCKER_URL + '/info');
			const serverTime = new Date((await serverTimeRes.json())['SystemTime']).getTime() ?? Date.now();
			const timestamp = Math.floor(serverTime / 1000);
			const res = await fetch(`${DOCKER_URL}/events?since=${timestamp - 60 * 60 * 24}&until=${timestamp}`,
				{mode: 'no-cors'},
			);
			const data = (await res.text()).split('\n');
			let events = [];
			for (const v of data) {
				if (v) {
					events.push(JSON.parse(v));
				}
			}
			events = events.filter(e => e.Action !== 'top');
			if (events.length > 0) {
				this.lastEvent = events[events.length - 1];
			}
			return events;
		} catch (e) {
			return [];
		}
	}

	public async getLastEvent():Promise<string | null> {
		await this.getEvents();
		return this.lastEvent;
	}
}
