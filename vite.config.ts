import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';
import svg from '@poppanator/sveltekit-svg';

const config: UserConfig = {
	plugins: [
		sveltekit(),
		svg({
			svgoOptions: {
				plugins: [
					{
						name: 'removeAttrs',
						params: {
							attrs: 'stroke-width'
						}
					},
					{
						name: 'prefixIds'
					}
				]
			}
		})
	],
	assetsInclude: ['**/*.conf', '**/*.{png,PNG,jpg,JPG,jpeg,JPEG}'],
	resolve: {
		alias: {
			$icons: path.resolve('./node_modules/heroicons/24/outline')
		}
	}
};

export default config;
