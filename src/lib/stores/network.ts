import {writable} from 'svelte/store';

export const networkAvailable = writable(false);

export const fetchNetworkAvailable = async ():Promise<void> => {
	const res = await fetch('/network/status');
	const data = await res.text();
	if (data === 'ok') {
		networkAvailable.set(true);
	} else {
		networkAvailable.set(false);
	}
};
