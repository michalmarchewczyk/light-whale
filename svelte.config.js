import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';
import { mdsvex } from 'mdsvex';
import urls from 'rehype-urls';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			rehypePlugins: [[urls, (url) => path.join('/docs', url.pathname ?? '')]]
		})
	],

	extensions: ['.svelte', '.md'],

	kit: {
		adapter: adapter(),
		alias: {
			$icons: path.resolve('./node_modules/heroicons/24/outline')
		}
	}
};

export default config;
