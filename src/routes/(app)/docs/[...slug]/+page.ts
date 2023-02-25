import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import pathBrowserify from 'path-browserify';

const allDocs = import.meta.glob('$lib/docs/**/*.md', { as: 'raw' });
const allImages = import.meta.glob('$lib/docs/**/*.{png,PNG,jpg,JPG,jpeg,JPEG}', { eager: true });

export const load = (async ({ params }) => {
	const slug = params.slug;
	let path = `/src/lib/docs/${slug || 'index'}.md`;
	if (!allDocs[path]) {
		path = `/src/lib/docs/${slug}/index.md`;
	}
	if (!allDocs[path]) {
		throw redirect(307, '/docs');
	}
	let raw = await allDocs[path]();
	let title = 'Docs';
	const frontmatter = raw.match(/^---[\s\S]*?---/);
	if (frontmatter) {
		title = frontmatter[0].match(/title: (.*)/)?.[1] ?? 'Docs';
		raw = raw.replace(/^---[\s\S]*?---/, '');
	}
	raw = raw.replaceAll(/!\[(.*)\]\((.*)\.(png|PNG|jpg|JPG|jpeg|JPEG)\)/g, (match, p0, p1, p2) => {
		const imagePath: string = pathBrowserify.join(path, '..', p1 + '.' + p2).replaceAll('\\', '/');
		if (!allImages[imagePath]) {
			return match;
		}
		const rawImage: { default: string } = allImages[imagePath] as { default: string };
		return `![${p0}](${rawImage.default})`;
	});
	return {
		title,
		raw
	};
}) satisfies PageLoad;
