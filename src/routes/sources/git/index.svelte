<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import {onMount} from 'svelte';
	import RepoSourceItem from '$lib/client/components/sources/RepoSourceItem.svelte';
	import RepoPullForm from '$lib/client/components/sources/RepoPullForm.svelte';
	import RepoRemoteItem from '$lib/client/components/sources/RepoRemoteItem.svelte';

	let items = [];
	let itemsGithub = [];
	let loading = true;

	const fetchItems = async ():Promise<void> => {
		const res = await fetch('/api/sources/git');
		if(res.status !== 200){
			return;
		}
		items = await res.json();
	};

	const fetchGitHubItems = async ():Promise<void> => {
		const res = await fetch('/api/sources/git/github');
		if(res.status !== 200){
			return;
		}
		itemsGithub = await res.json();
		loading = false;
	};

	onMount(async() => {
		await fetchItems();
		await fetchGitHubItems();
	});
</script>

<svelte:head>
	<title>Sources / Git</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<ListHeader title="Sources / Git" badge="{items.length} downloaded repos / {itemsGithub.length} remote repos">
	</ListHeader>
	<div class="p-8 pt-2">
		<RepoPullForm fetchItems={() => fetchItems()}/>
		{#each items as item}
			<RepoSourceItem repo={item}/>
		{:else}
			<p class="w-full text-center text-3xl p-4 opacity-50">No repositories pulled</p>
		{/each}
		<div class="divider"></div>
		{#each itemsGithub as item}
			<RepoRemoteItem repo={item}/>
		{:else}
			<p class="w-full text-center text-3xl p-4 opacity-50">
				{loading ? 'Loading...' : 'Could not find any remote repositories'}
			</p>
		{/each}
	</div>
</div>


<style lang="scss">

</style>
