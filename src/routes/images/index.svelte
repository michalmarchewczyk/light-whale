<script lang="ts">
	import {images} from '$lib/stores/images';
	import ImageItem from './_ImageItem.svelte';

</script>

<svelte:head>
	<title>Images</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
		Images
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{$images.length} images
		</div>
	</div>
</div>
<div class="p-8 pt-2">
	{#each $images as image}
		<ImageItem image={image}/>
	{/each}
</div>

<style lang="scss">

</style>
