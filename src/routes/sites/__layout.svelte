<script lang="ts">
	import {onMount} from 'svelte';
	import {fetchImages} from '$lib/client/stores/images';
	import {fetchContainers} from '$lib/client/stores/containers';
	import {fetchSites} from '$lib/client/stores/sites';

	onMount(async () => {
		await fetchSites();
		await fetchImages();
		await fetchContainers();
	});
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<slot></slot>
</div>

<style lang="scss">

</style>
