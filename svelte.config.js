import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	extensions: ['.svelte', '.md'],

	kit: {
		adapter: adapter({
			precompress: true
		}),
		alias: {
			$icons: path.resolve('./node_modules/heroicons/24/outline')
		},
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
