import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type Component from 'svelte/types/compiler/compile/Component';

const allDocs = import.meta.glob('$lib/docs/**/*.md');

type Doc = {
	metadata: {
		title: string;
	};
	default: Component;
};

export const load = (async ({ params }) => {
	const slug = params.slug;
	let path = `/src/lib/docs/${slug || 'index'}.md`;
	if (!allDocs[path]) {
		path = `/src/lib/docs/${slug}/index.md`;
	}
	if (!allDocs[path]) {
		throw redirect(307, '/docs');
	}
	const doc: Doc = (await allDocs[path]()) as Doc;
	return {
		title: doc.metadata.title,
		component: doc.default
	};
}) satisfies PageLoad;
