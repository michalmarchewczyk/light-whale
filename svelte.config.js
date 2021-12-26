import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import tildeImporter from 'node-sass-tilde-importer';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			scss: {
				importer: tildeImporter,
			},
		}),
	],

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
	},
};

export default config;
