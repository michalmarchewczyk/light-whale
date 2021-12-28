import {writable} from 'svelte/store';

export const dockerAvailable = writable(false);

export const fetchDockerAvailable = async ():Promise<void> => {
	const res = await fetch('/docker/ping');
	const data = await res.text();
	if(data === 'true'){
		dockerAvailable.set(true);
	}else{
		dockerAvailable.set(false);
	}
};


