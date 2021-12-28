<script lang="ts">
	import {onMount} from 'svelte';
	import {containers, fetchContainers} from '$lib/stores/docker';
	import ContainerItem from './_ContainerItem.svelte';

	onMount(async () => {
		await fetchContainers();
	});
</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>



<div>
	{#each $containers as container}
		<ContainerItem key={container.id} {container}/>
	{/each}
</div>

<style lang="scss">

</style>
