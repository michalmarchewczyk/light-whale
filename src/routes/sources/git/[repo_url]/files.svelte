<script>
	import FileBrowser from '$lib/client/components/FileBrowser.svelte';
	import {page} from '$app/stores';

	const readPath = async (path) => {
		const res = await fetch(`/api/sources/git/${$page.params.repo_url}/files?path=${path}`);
		if (res.status !== 200) {
			return null;
		}
		return await res.json();
	};

</script>

<FileBrowser readPath={readPath}/>
