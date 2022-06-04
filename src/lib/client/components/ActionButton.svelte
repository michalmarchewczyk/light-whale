<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	export let icon;
	export let loading;
	export let disabled = false;
	export let neutral = false;

	const dispatch = createEventDispatcher();
</script>

<button class="btn btn-primary justify-start btn-block text-base px-2 min-h-0 {$$props.class}"
		class:loading={loading} class:btn-disabled={loading || disabled}
		class:text-neutral-content={(loading || disabled) && neutral}
		class:bg-neutral-focus={(loading || disabled) && neutral}
		class:text-opacity-50={(loading || disabled) && neutral}
		on:click={() => dispatch('click')}>
	{#if !loading}
		<svelte:component this={icon} class="h-6 w-6 mr-2 stroke-2"/>
	{/if}
	<span class="mt-[-0.25rem]">
		<slot></slot>
	</span>
</button>

<style lang="scss">

</style>
