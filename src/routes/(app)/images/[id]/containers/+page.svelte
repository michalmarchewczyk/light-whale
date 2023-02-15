<script lang="ts">
	import type ContainerData from '$lib/server/docker/ContainerData';
	import type ImageData from '$lib/server/docker/ImageData';
	import ContainerItem from '$lib/client/components/containers/ContainerItem.svelte';

	export let data: { image: ImageData; imageContainers: ContainerData[] };
</script>

{#each data.imageContainers as container}
	<ContainerItem {container} />
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">Image isn't used in any containers</p>
{/each}
