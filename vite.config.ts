import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
	plugins: [sveltekit()],
	assetsInclude: ['**/*.conf'],
	resolve: {
		alias: {
			$icons: path.resolve('./node_modules/heroicons/24/outline')
		}
	}
};

export default config;
