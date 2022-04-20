<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import {onMount} from 'svelte';
	import RepoSourceItem from '$lib/client/components/sources/RepoSourceItem.svelte';

	let items = [];

	const fetchItems = async ():Promise<void> => {
		const res = await fetch('/api/sources/git');
		if(res.status !== 200){
			return;
		}
		items = await res.json();
	};

	onMount(async() => {
		await fetchItems();
	});
</script>

<svelte:head>
	<title>Sources / Git</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<ListHeader title="Sources / Git">
	</ListHeader>
	<div class="p-8 pt-2">
		{#each items as item}
			<RepoSourceItem repo={item}/>
		{/each}
	</div>
</div>


<style lang="scss">

</style>
