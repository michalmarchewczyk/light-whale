<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import ImageSourceItem from '$lib/client/components/sources/ImageSourceItem.svelte';
	import { createDebouncer } from '$lib/client/utils/debounce';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	let query = $page.url.searchParams.get('search') || '';

	const search = createDebouncer(() => {
		goto(`/sources/dockerhub?search=${query}`, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}, 100);

	let found = 0;

	$: {
		data?.results.images.then((images) => {
			found = images.length;
		});
	}
</script>

<svelte:head>
	<title>Dockerhub Sources - Light-Whale</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<ListHeader title="Sources / DockerHub" badge="{found}{found === 50 ? '+' : ''} found">
		<div class="inline-block">
			<span class="text-lg font-semibold align-middle capitalize">Search:</span>
			<input
				class="input input-bordered bg-base-100 align-middle ml-2 text-base font-semibold w-64"
				bind:value={query}
				on:input={search}
				placeholder="Search..."
			/>
		</div>
	</ListHeader>
	<div class="p-8 pt-2">
		{#await data.results.images}
			<p class="w-full text-center text-3xl p-12 opacity-50">Loading...</p>
		{:then images}
			{#each images as image}
				<ImageSourceItem {image} />
			{:else}
				<p class="w-full text-center text-3xl p-12 opacity-50">Not found</p>
			{/each}
			{#if images.length === 50}
				<p class="w-full text-center text-xl p-4 opacity-50">
					Found more than 50 images. Please refine your search.
				</p>
			{/if}
		{/await}
	</div>
</div>
