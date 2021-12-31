import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import tildeImporter from 'node-sass-tilde-importer';
import path from 'path';
import {svelteSVG} from 'rollup-plugin-svelte-svg';

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

		vite: {
			resolve: {
				alias: {
					$icons: path.resolve('./node_modules/heroicons/outline')
				}
			},
			plugins: [
				svelteSVG({
					svgo: {
						plugins: [
							{
								name: 'removeAttrs',
								params: {
									attrs: 'stroke-width'
								}
							}
						]
					},
					enforce: 'pre',
				})
			]
		}
	},
};

export default config;
