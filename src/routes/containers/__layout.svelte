<script lang="ts">
	import {fetchContainers} from '$lib/client/stores/containers';
	import {onMount} from 'svelte';
	import {fetchImages} from '$lib/client/stores/images';
	import {fetchSites} from '$lib/client/stores/sites';

	onMount(async () => {
		await fetchContainers();
		await fetchImages();
		await fetchSites();
	});
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<slot></slot>
</div>

<style lang="scss">

</style>
