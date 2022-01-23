import {dockerUrl} from '$lib/docker/config';

let lastEvent = null;

export const getEvents = async ():Promise<Record<string, unknown>[]> => {
	try {
		const serverTimeRes = await fetch(dockerUrl + '/info');
		const serverTime = new Date((await serverTimeRes.json())['SystemTime']).getTime() ?? Date.now();
		const timestamp = Math.floor(serverTime / 1000);
		const res = await fetch(`${dockerUrl}/events?since=${timestamp - 60 * 60 * 24}&until=${timestamp}`,
			{mode: 'no-cors'},
		);
		const data = (await res.text()).split('\n');
		const events = [];
		for (const v of data) {
			if (v) {
				events.push(JSON.parse(v));
			}
		}
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
