<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	export let icon;
	export let loading;
	export let disabled = false;

	const dispatch = createEventDispatcher();
</script>

<button class="btn btn-primary justify-start btn-block text-base px-2 min-h-0 {$$props.class}"
		class:loading={loading} disabled={loading || disabled} on:click={() => dispatch('click')}>
	{#if !loading}
		<svelte:component this={icon} class="h-6 w-6 mr-2 stroke-2"/>
	{/if}
	<span class="mt-[-0.25rem]">
		<slot></slot>
	</span>
</button>

<style lang="scss">

</style>
