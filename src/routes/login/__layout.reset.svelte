<script context="module" lang="ts">
	import type {LoadInput, LoadOutput} from '@sveltejs/kit';

	export async function load({session}:LoadInput):Promise<LoadOutput> {
		if (session.id) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {
			props: {}
		};
	}
</script>

<svelte:head>
	<title>Light-Whale</title>
</svelte:head>

<div class="flex w-screen h-screen justify-center items-center">
	<slot></slot>
</div>

<style lang="scss">
  :global(body) {
	@apply bg-base-200 w-screen h-screen;
  }
</style>
