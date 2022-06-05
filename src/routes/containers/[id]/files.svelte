<script lang="ts">
	import {page} from '$app/stores';
	import FileBrowser from '$lib/client/components/containers/FileBrowser.svelte';
	import type {Container} from '$lib/client/stores/containers';
	import { containers} from '$lib/client/stores/containers';
	import * as path from 'path-browserify';

	let container:Container = null;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	let currentPath = '/';
	let loading = true;
	let loadedPath = null;

	let files = [];
	let fileContent = '';
	let fileName = '';

	const getFiles = async () => {
		if (!container?.id || container?.state !== 'running') return;
		loading = true;
		const res = await fetch(`/api/docker/containers/${container?.id}/files?path=${currentPath}&type=dir`);
		if (res.status !== 200) {
			loading = false;
			loadedPath = currentPath;
			return;
		}
		const data = await res.json();
		loadedPath = currentPath;
		files = data;
		loading = false;
	};

	const readFile = async (name) => {
		if (!container?.id || container?.state !== 'running') return;
		loading = true;
		const filePath = path.join(currentPath, name);
		const res = await fetch(`/api/docker/containers/${container?.id}/files?path=${filePath}&type=file`);
		if (res.status !== 200) {
			loading = false;
			return;
		}
		fileContent = await res.text();
		loading = false;
	};

	const openFile = async (event) => {
		const file = event.detail;
		if (file.directory) {
			currentPath = path.join(currentPath, file.name);
		}else{
			await readFile(file.name);
			fileName = file.name;
		}
	};

	$: {
		if (container && loadedPath !== currentPath) {
			getFiles();
		}
		if(fileContent === ''){
			fileName = '';
		}
	}

</script>

{#if container?.state === 'running'}
	<FileBrowser path={$page.params.id+': '+path.join(currentPath,fileName)} files={files} loading={loading} on:open={openFile} bind:file={fileContent}/>
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">Container has to be running to view files</p>
{/if}


<style lang="scss">

</style>


