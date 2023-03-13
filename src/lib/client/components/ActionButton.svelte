<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let icon;
	export let iconPosition: 'left' | 'right' = 'left';
	export let loading = false;
	export let disabled = false;
	export let neutral = false;
	export let formaction: string | undefined = undefined;
	export let type: string | undefined = undefined;
	export let href: string | undefined = undefined;
	const dispatch = createEventDispatcher();
</script>

{#if href}
	<a
		class="btn btn-primary justify-start btn-block text-base px-2 min-h-0 {$$props.class}"
		{href}
		target={href.startsWith('http') ? '_blank' : undefined}
		rel={href.startsWith('http') ? 'noreferrer' : undefined}
	>
		{#if iconPosition === 'left'}
			<svelte:component this={icon} class="h-5 w-5 mr-2 stroke-[2.2]" />
		{/if}
		<span class="mt-[-3px]">
			<slot />
		</span>
		{#if iconPosition === 'right'}
			<svelte:component this={icon} class="h-5 w-5 ml-2 stroke-[2.2]" />
		{/if}
	</a>
{:else}
	<button
		class="btn btn-primary justify-start btn-block text-base px-2 min-h-0 {$$props.class}"
		class:loading
		class:btn-disabled={loading || disabled}
		class:text-neutral-content={(loading || disabled) && neutral}
		class:bg-neutral-focus={(loading || disabled) && neutral}
		class:text-opacity-50={(loading || disabled) && neutral}
		on:click={() => dispatch('click')}
		{formaction}
		{type}
	>
		{#if !loading && iconPosition === 'left'}
			<svelte:component this={icon} class="h-5 w-5 mr-2 stroke-[2.2]" />
		{/if}
		<span class="mt-[-3px] px-0.5">
			<slot />
		</span>
		{#if !loading && iconPosition === 'right'}
			<svelte:component this={icon} class="h-5 w-5 ml-2 stroke-[2.2]" />
		{/if}
	</button>
{/if}
