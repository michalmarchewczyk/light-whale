<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import {onMount} from 'svelte';
	import {browser} from '$app/env';
	import ImageSourceItem from '$lib/client/components/sources/ImageSourceItem.svelte';

	let items = [];
	let search = '';

	const fetchItems = async (search=''):Promise<void> => {
		const res = await fetch(`/api/sources/dockerhub/search?query=${search}`);
		if(res.status !== 200){
			return;
		}
		const data = await res.json();
		if(data.count === 0){
			items = [];
		}
		items = data['summaries'] ?? items ?? [];
	};

	onMount(async() => {
		await fetchItems();
	});

	$: {
		if(browser){
			fetchItems(search.length === 1 ? '' : search);
		}
	}

</script>

<svelte:head>
	<title>Sources / DockerHub</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<ListHeader title="Sources / DockerHub" badge="{items.length}{items.length === 50 ? '+' : ''} found">
		<div class="inline-block {$$props.class}">
			<span class="text-lg font-semibold align-middle capitalize">Search:</span>
			<input class="input input-bordered bg-base-100 align-middle ml-2 w-36 text-base font-semibold w-64"
				   bind:value={search} placeholder="Search..."/>
		</div>
	</ListHeader>
	<div class="p-8 pt-2">
		{#each items as item}
			<ImageSourceItem image={item}/>
		{:else}
			<p class="w-full text-center text-3xl p-12 opacity-50">Not found</p>
		{/each}
		{#if items.length === 50}
			<p class="w-full text-center text-xl p-4 opacity-50">Found more than 50 images. Please refine your search.</p>
		{/if}
	</div>
</div>


<style lang="scss">

</style>
