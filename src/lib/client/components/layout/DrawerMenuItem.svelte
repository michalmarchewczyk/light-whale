<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	export let icon;
	export let path;
	const dispatch = createEventDispatcher();
</script>

<li class="mb-1 text-base-content font-semibold">
	<a
		href={path}
		on:click={() => dispatch('click')}
		sveltekit:prefetch
		class:bg-base-300={path !== '/'
			? $page.url.pathname.startsWith(path)
			: $page.url.pathname === path}
	>
		<svelte:component this={icon} class="h-6 w-6 stroke-2" />
		<span class="mx-1 text-base mt-[-0.125rem]">
			<slot />
		</span>
	</a>
</li>

<style lang="scss">
</style>
