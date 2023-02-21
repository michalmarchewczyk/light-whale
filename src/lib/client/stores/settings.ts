import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const theme = writable<'default-light' | 'default-dark'>('default-light');
export const animations = writable<boolean>(true);

if (browser) {
	if (localStorage.theme) {
		theme.set(localStorage.theme);
	}
	if (localStorage.animations) {
		animations.set(localStorage.animations === 'true');
	}

	theme.subscribe((theme) => {
		localStorage.theme = theme;
	});
	animations.subscribe((animations) => {
		localStorage.animations = animations;
	});
}
