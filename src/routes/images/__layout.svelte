<script lang="ts">
	import {onMount} from 'svelte';
	import {fetchImages} from '$lib/stores/images';

	onMount(async () => {
		await fetchImages();
	});
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<slot></slot>
</div>

<style lang="scss">

</style>
