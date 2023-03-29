<script lang="ts">
	import FileBrowser from '$lib/client/components/FileBrowser.svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	export let data: PageData;

	const readPath = async (path) => {
		if (!browser) {
			return null;
		}
		const res = await fetch(`/api/containers/${data.container?.id}/files?path=${path}`);
		if (res.status !== 200) {
			return null;
		}
		return await res.json();
	};
</script>

<svelte:head>
	<title>Container Files - Light-Whale</title>
</svelte:head>

{#if data.container?.state === 'running'}
	<FileBrowser {readPath} />
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">
		Container has to be running to view files
	</p>
{/if}

<style lang="scss">
</style>
