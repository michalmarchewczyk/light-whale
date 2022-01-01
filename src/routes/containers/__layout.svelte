<script lang="ts">
	import {fetchContainers} from '$lib/stores/containers';
	import {onMount} from 'svelte';

	onMount(async () => {
		await fetchContainers();
	});
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<slot></slot>
</div>

<style lang="scss">

</style>
