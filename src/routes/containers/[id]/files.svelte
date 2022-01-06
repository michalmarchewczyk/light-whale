<script lang="ts">
	import {page} from '$app/stores';
	import FileBrowser from '$lib/components/FileBrowser.svelte';
	import {Container, containers} from '$lib/stores/containers';
	import * as path from 'path-browserify';

	let container:Container = null;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	let currentPath = '/';
	let loading = true;
	let loadedPath = null;

	let files = [];

	const getFiles = async () => {
		loading = true;
		const res = await fetch(`/docker/files?id=${container?.id}&path=${currentPath}`);
		if(res.status !== 200){
			loading = false;
			loadedPath = currentPath;
			return;
		}
		const data = await res.json();
		loadedPath = currentPath;
		files = data;
		loading = false;
	};

	const openFile = async (event) => {
		const file = event.detail;
		if(file.directory){
			currentPath = path.join(currentPath, file.name);
		}
	};

	$: {
		if (container && loadedPath !== currentPath) {
			getFiles();
		}
	}

</script>

{#if container?.state === 'running'}
	<FileBrowser path={$page.params.id+': '+currentPath} files={files} loading={loading} on:open={openFile}/>
{:else}
	<p>Container has to be running</p>
{/if}


<style lang="scss">

</style>


