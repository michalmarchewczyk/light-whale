import type { LayoutLoad } from './$types';

const allDocs = import.meta.glob('$lib/docs/**/*.md', { as: 'raw' });

export const load = (async () => {
	const docs = await Promise.all(
		Object.keys(allDocs).map(async (key) => {
			const raw = await allDocs[key]();
			const frontmatter = raw.match(/^---[\s\S]*?---/);
			const title = frontmatter?.[0].match(/title: (.*)/)?.[1] ?? 'Docs';
			const path = key.replace('/src/lib', '').replace('.md', '').replace('/index', '');
			return {
				title: title ?? path.replace('/docs', ''),
				path
			};
		})
	);
	return {
		docs
	};
}) satisfies LayoutLoad;
