import {DOCKER_URL} from '$lib/server/docker/config';
import {logger, LogType} from '$lib/server/utils/Logger';

let lastEvent = null;

export const getEvents = async ():Promise<Record<string, unknown>[]> => {
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
			lastEvent = events[events.length - 1];
		}
		return events;
	} catch (e) {
		return [];
	}
};

export const getLastEvent = async ():Promise<Record<string, unknown>> => {
	await getEvents();
	return lastEvent;
};
