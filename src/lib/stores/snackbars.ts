import {writable} from 'svelte/store';

export interface Snackbar {
	type:'INFO'|'SUCCESS'|'WARNING'|'ERROR',
	msg:string,
	visible:boolean,
}

export const snackbars = writable<Snackbar[]>([]);


export const newSnackbar = (type:Snackbar['type'], msg:string):void => {
	const snackbar = {
		type,
		msg,
		visible: true,
	};
	snackbars.update(v => [...v, snackbar]);
	setTimeout(() => {
		snackbar.visible = false;
		snackbars.update(v => v);
	}, 4000);
};




