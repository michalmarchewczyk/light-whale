<script lang="ts">
	import {Image, images} from '$lib/stores/images';
	import ImageItem from '$lib/components/images/ImageItem.svelte';
	import {containers} from '$lib/stores/containers';
	import {paramsToLink} from '$lib/utils/paramsToLink';
	import {page} from '$app/stores';

	let usedCount:number;
	$: usedCount = $images.filter(i => $containers.filter(c => c.imageId === i.id).length > 0).length;

	let filteredImages:Image[];

	$: {
		filteredImages = $images;
		if ($page.url.searchParams.get('used') === 'used') {
			filteredImages = filteredImages.filter(i => $containers.filter(c => c.imageId === i.id).length > 0);
		}
		if ($page.url.searchParams.get('used') === 'unused') {
			filteredImages = filteredImages.filter(i => $containers.filter(c => c.imageId === i.id).length === 0);
		}
		if ($page.url.searchParams.get('sort')) {
			let sortName = $page.url.searchParams.get('sort');
			let sortOrder = $page.url.searchParams.get('order');
			if (sortName === 'name') {
				filteredImages = filteredImages.sort((a, b) => a.tags[0] < b.tags[0] ? 1 : -1);
			} else if (sortName === 'created') {
				filteredImages = filteredImages.sort((a, b) => a.created < b.created ? 1 : -1);
			} else if (sortName === 'size') {
				filteredImages = filteredImages.sort((a, b) => b.size - a.size);
			}
			if (sortOrder === 'asc') {
				filteredImages = filteredImages.reverse();
			}
		}
	}
</script>

<svelte:head>
	<title>Images</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
		Images
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{usedCount} / {$images.length} used
		</div>
		<div class="w-full mt-6 text-base font-normal">
			<div class="float-right">
				<span class="text-lg font-semibold align-middle">Sort:</span>
				<div class="dropdown">
					<button class="select select-bordered bg-base-100 align-middle ml-2 w-44 capitalize">
						{#if $page.url.searchParams.get('sort')}
							<span class="mt-2 text-base">{$page.url.searchParams.get('sort')}
								({$page.url.searchParams.get('order')})</span>
						{:else}
							<span class="mt-2 text-base">Created (desc)</span>
						{/if}
					</button>
					<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-44 ml-2">
						<li><a href="{paramsToLink($page.url.search, {sort: 'created', order: 'asc'})}">
							Created (asc)
						</a></li>
						<li><a href="{paramsToLink($page.url.search, {sort: 'created', order: 'desc'})}">
							Created (desc)
						</a></li>
						<li><a href="{paramsToLink($page.url.search, {sort: 'name', order: 'asc'})}">
							Name (asc)
						</a></li>
						<li><a href="{paramsToLink($page.url.search, {sort: 'name', order: 'desc'})}">
							Name (desc)
						</a></li>
						<li><a href="{paramsToLink($page.url.search, {sort: 'size', order: 'asc'})}">
							Size (asc)
						</a></li>
						<li><a href="{paramsToLink($page.url.search, {sort: 'size', order: 'desc'})}">
							Size (desc)
						</a></li>
					</ul>
				</div>
			</div>

			<span class="text-lg font-semibold align-middle">Used:</span>
			<div class="dropdown">
				<button class="select select-bordered bg-base-100 align-middle ml-2 w-36 capitalize">
					{#if $page.url.searchParams.get('used')}
						<span class="mt-2 text-base">{$page.url.searchParams.get('used')}</span>
					{:else}
						<span class="mt-2 text-base">All</span>
					{/if}
				</button>
				<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-36 ml-2">
					<li><a href="{paramsToLink($page.url.search, {used: 'all'})}">
						All
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {used: 'used'})}">
						Used
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {used: 'unused'})}">
						Unused
					</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
<div class="p-8 pt-2">
	{#each filteredImages as image}
		<ImageItem image={image}/>
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No images</p>
	{/each}
</div>

<style lang="scss">

</style>
