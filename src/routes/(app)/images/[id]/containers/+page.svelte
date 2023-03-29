<script lang="ts">
	import ContainerItem from '$lib/client/components/containers/ContainerItem.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Image Containers - Light-Whale</title>
</svelte:head>

{#each data.imageContainers as container}
	<ContainerItem {container} />
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">Image isn't used in any containers</p>
{/each}
