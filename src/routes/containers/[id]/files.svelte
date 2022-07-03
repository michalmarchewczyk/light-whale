<script lang="ts">
	import {page} from '$app/stores';
	import FileBrowser from '$lib/client/components/FileBrowser.svelte';
	import type {Container} from '$lib/client/stores/containers';
	import {containers} from '$lib/client/stores/containers';

	let container:Container = null;
	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	const readPath = async (path) => {
		const res = await fetch(`/api/docker/containers/${container?.id}/files?path=${path}`);
		if (res.status !== 200) {
			return null;
		}
		return await res.json();
	};
</script>

{#if container?.state === 'running'}
	<FileBrowser readPath={readPath}/>
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">Container has to be running to view files</p>
{/if}


<style lang="scss">

</style>


