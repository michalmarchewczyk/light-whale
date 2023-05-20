<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import SortMenu from '$lib/client/components/lists/SortMenu.svelte';
	import FilterMenu from '$lib/client/components/lists/FilterMenu.svelte';
	import type ImageData from '$lib/server/docker/ImageData';
	import ImageItem from '$lib/client/components/images/ImageItem.svelte';
	import { hideLwContainer } from '$lib/client/stores/settings';
	import type { PageData } from './$types';

	export let data: PageData;

	$: usedCount = data?.images.filter(
		(i) => data.containers.filter((c) => c.imageId === i.id).length > 0
	).length;

	let sort = '';
	let order = '';
	let used = '';

	let filteredImages: ImageData[] = [];

	$: {
		filteredImages = data.images;
		if ($hideLwContainer) {
			filteredImages = filteredImages.filter(
				(i) => !i.tags[0]?.startsWith('mmarchewczyk/light-whale-nginx')
			);
		}
		if (used === 'used') {
			filteredImages = filteredImages.filter(
				(i) => data.containers.filter((c) => c.imageId === i.id).length > 0
			);
		}
		if (used === 'unused') {
			filteredImages = filteredImages.filter(
				(i) => data.containers.filter((c) => c.imageId === i.id).length === 0
			);
		}
		if (sort === 'name') {
			filteredImages = filteredImages.sort((a, b) => (a.tags[0] < b.tags[0] ? 1 : -1));
		} else if (sort === 'created') {
			filteredImages = filteredImages.sort((a, b) => (a.created < b.created ? 1 : -1));
		} else if (sort === 'size') {
			filteredImages = filteredImages.sort((a, b) => b.size - a.size);
		}
		if (sort && order === 'asc') {
			filteredImages = filteredImages.reverse();
		}
	}
</script>

<svelte:head>
	<title>Images - Light-Whale</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<ListHeader title="Images" badge="{usedCount} / {data.images.length} used">
		<SortMenu
			bind:value={sort}
			bind:order
			values={['created', 'name', 'size']}
			class="float-right"
		/>
		<FilterMenu name="used" bind:value={used} values={['all', 'used', 'unused']} class="mr-4" />
	</ListHeader>
</div>

<div class="p-8 pt-2">
	{#each filteredImages as image}
		<ImageItem {image} used={data.containers.filter((c) => c.imageId === image.id).length > 0} />
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No images</p>
	{/each}
</div>
