<script lang="ts">
	import {page} from '$app/stores';
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';

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
	<div class="p-8 pt-2">

	</div>
</div>


<style lang="scss">

</style>
