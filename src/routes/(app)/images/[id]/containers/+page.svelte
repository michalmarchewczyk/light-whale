<script lang="ts">
	import type ContainerData from '$lib/server/docker/ContainerData';
	import type ImageData from '$lib/server/docker/ImageData';
	import ContainerItem from '$lib/client/components/containers/ContainerItem.svelte';
	import { hideLwContainer } from '$lib/client/stores/settings';
	import { LW_NGINX_CONTAINER_NAME } from '$lib/client/config';

	export let data: { image: ImageData; imageContainers: ContainerData[] };

	if ($hideLwContainer) {
		data.imageContainers = data.imageContainers.filter(
			(c) => c.name !== '/' + LW_NGINX_CONTAINER_NAME
		);
	}
</script>

<svelte:head>
	<title>Image Containers - Light-Whale</title>
</svelte:head>

{#each data.imageContainers as container}
	<ContainerItem {container} />
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">Image isn't used in any containers</p>
{/each}
