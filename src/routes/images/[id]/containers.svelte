<script lang="ts">
	import type {Container} from '$lib/stores/containers';
	import {Image, images} from '$lib/stores/images';
	import {page} from '$app/stores';
	import ContainerItem from '../../containers/_ContainerItem.svelte';
	import {containers} from '$lib/stores/containers';

	let image:Image;

	$: image = $images.find(i => i.id.startsWith('sha256:'+$page.params.id));

	let usedContainers:Container[];

	$: usedContainers = $containers?.filter(c => c.imageId === image.id) ?? [];

</script>

{#each usedContainers as container}
	<ContainerItem container={container}/>
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">Image isn't used in any containers</p>
{/each}

<style lang="scss">

</style>
