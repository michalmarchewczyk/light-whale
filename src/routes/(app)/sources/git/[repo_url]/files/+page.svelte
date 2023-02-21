<script lang="ts">
	import FileBrowser from '$lib/client/components/FileBrowser.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	const readPath = async (path) => {
		if (browser) {
			const res = await fetch(
				`/api/sources/git/${encodeURIComponent($page.params.repo_url)}/files?path=${path}`
			);
			if (res.status !== 200) {
				return null;
			}
			return await res.json();
		}
	};
</script>

<svelte:head>
	<title>Git Repo Files - Light-Whale</title>
</svelte:head>

<FileBrowser {readPath} />
