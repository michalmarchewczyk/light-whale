<script lang="ts">
	import {onMount} from 'svelte';
	import {fetchImages} from '$lib/stores/images';
	import {fetchContainers} from '$lib/stores/containers';

	onMount(async () => {
		await fetchImages();
		await fetchContainers();
	});
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<slot></slot>
</div>

<style lang="scss">

</style>
