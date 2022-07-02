<script lang="ts">
	import {page} from '$app/stores';
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import FolderIcon from '$icons/folder.svg';
	import PageMenu from '$lib/client/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/client/components/page/PageMenuItem.svelte';
	import GitIcon from '$lib/client/assets/icons/git.svg';

	let name = decodeURIComponent($page.params.repo_url);
	if(name.startsWith('https://github.com/')){
		name = name.split('github.com/')[1];
	}
	if(name.endsWith('.git')){
		name = name.slice(0, -4);
	}
</script>

<svelte:head>
	<title>Sources / Git</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<PageHeader badge="">
		<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/sources/git">
			Sources / Git /
		</a>
		{name}
	</PageHeader>
	<PageMenu>
		<PageMenuItem path="/sources/git/{$page.params.repo_url}" icon={GitIcon}>
			General
		</PageMenuItem>
		<PageMenuItem path="/sources/git/{$page.params.repo_url}/files" icon={FolderIcon}>
			Files
		</PageMenuItem>
	</PageMenu>

	<div class="mx-4 mt-8 mb-8">
		<slot></slot>
	</div>
</div>


<style lang="scss">

</style>
