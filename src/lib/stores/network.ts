import {writable} from 'svelte/store';

export const networkAvailable = writable(false);
export const nginxAvailable = writable(false);
export const nginxConnected = writable(false);
export const nginxConfig = writable('');

export const fetchNetworkAvailable = async ():Promise<void> => {
	const res = await fetch('/network/status');
	const data = await res.text();
	if (data === 'ok') {
		networkAvailable.set(true);
	} else {
		networkAvailable.set(false);
	}
};

export const fetchNginxAvailable = async ():Promise<void> => {
	const res = await fetch('/network/nginx');
	const data = await res.text();
	if (data === 'ok') {
		nginxAvailable.set(true);
		nginxConnected.set(true);
	} else if(data === 'not connected'){
		nginxAvailable.set(true);
		nginxConnected.set(false);
	}else{
		nginxAvailable.set(false);
		nginxConnected.set(false);
	}
};

export const fetchNginxConfig = async ():Promise<void> => {
	const res = await fetch('/network/nginxConfig');
	const data = await res.text();
	nginxConfig.set(data);
};

