<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	let ref: HTMLDivElement;
	let portal: HTMLDivElement;

	onMount(() => {
		if (browser) {
			portal = document.createElement('div');
			portal.className = 'portal';
			document.body.appendChild(portal);
			portal.appendChild(ref);
		}
	});

	onDestroy(() => {
		if (browser) {
			portal.remove();
		}
	});
</script>

<div class="portal-clone">
	<div bind:this={ref}>
		<slot />
	</div>
</div>

<style lang="scss">
	.portal-clone {
		display: none;
	}
</style>
