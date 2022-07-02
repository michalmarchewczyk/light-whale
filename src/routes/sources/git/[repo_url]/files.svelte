<script>
	import FileBrowser from '$lib/client/components/FileBrowser.svelte';
	import * as path from 'path-browserify';
	import {page} from '$app/stores';

	let currentPath = '/';
	let loading = true;
	let loadedPath = null;

	let files = [];
	let fileContent = '';
	let fileName = '';

	const getFiles = async () => {
		loading = true;
		const res = await fetch(`/api/sources/git/${$page.params.repo_url}/files?path=${currentPath}&type=dir`);
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
		loading = true;
		const filePath = path.join(currentPath, name);
		const res = await fetch(`/api/sources/git/${$page.params.repo_url}/files?path=${filePath}&type=file`);
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
		if (loadedPath !== currentPath) {
			getFiles();
		}
		if(fileContent === ''){
			fileName = '';
		}
	}

</script>

<FileBrowser path={path.join(currentPath,fileName)} files={files} loading={loading} on:open={openFile} bind:file={fileContent}/>
