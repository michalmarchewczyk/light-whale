import type { LayoutLoad } from './$types';

const allDocs = import.meta.glob('$lib/docs/**/*.md', { as: 'raw' });

export const load = (async () => {
	const index: string[] = [];
	let docs = (
		await Promise.all(
			Object.keys(allDocs).map(async (key) => {
				if (key.endsWith('toc.md')) {
					let raw = await allDocs[key]();
					raw = raw.replace(/^---[\s\S]*?---/, '');
					[...raw.matchAll(/( *)(\d+).\s\[(.*)\]\((.*)\.(md|MD)\)/g)].forEach((match) => {
						index.push(match[4].replace('/index', ''));
					});
					return null;
				}
				const raw = await allDocs[key]();
				const frontmatter = raw.match(/^---[\s\S]*?---/);
				const title = frontmatter?.[0].match(/title: (.*)/)?.[1] ?? 'Docs';
				const path = key.replace('/src/lib', '').replace('.md', '').replace('/index', '');
				return {
					title: title ?? path.replace('/docs', ''),
					path
				};
			})
		)
	).filter((d): d is { title: string; path: string } => !!d);
	docs = docs.sort((a, b) => {
		const aIndex = index.indexOf(a.path.replace('/docs/', ''));
		const bIndex = index.indexOf(b.path.replace('/docs/', ''));
		return aIndex - bIndex;
	});
	return {
		docs
	};
}) satisfies LayoutLoad;
