import {writable} from 'svelte/store';

interface Status {
	dockerRunning: boolean;
	dockerPinging: boolean;
	network: boolean;
	running: boolean;
	connected: boolean;
	ports: boolean;
	restartPolicy: boolean;
}

export const status = writable<Status>({
	dockerRunning: false,
	dockerPinging: false,
	network: false,
	running: false,
	connected: false,
	ports: false,
	restartPolicy: false,
});

export const fetchStatus = async ():Promise<void> => {
	const res = await fetch('/api/check?skipLogger=true');
	if(res.status !== 200){
		return;
	}
	const data = await res.json();
	status.set(data);
};
