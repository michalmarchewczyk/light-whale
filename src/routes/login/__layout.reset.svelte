<script context="module" lang="ts">
	import type {LoadInput, LoadOutput} from '@sveltejs/kit';

	export async function load({session, fetch}:LoadInput):Promise<LoadOutput> {
		const res = await fetch('/login/check');
		const isSetup = await res.text();
		if(isSetup !== 'true'){
			return {
				status: 302,
				redirect: '/setup'
			};
		}
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

<script lang="ts">
	import Background from '$lib/assets/background.svg';
	import Logotype from '$lib/assets/logotype_white.png';
</script>

<svelte:head>
	<title>Light-Whale</title>
</svelte:head>

<div class="fixed top-0 left-0 h-screen w-screen">
	<Background class="absolute top-0 left-0 h-5/6 w-auto"/>
	<img src={Logotype} class="absolute h-24 w-auto top-8 left-8" alt="Light-Whale"/>
</div>
<div class="flex w-screen h-screen justify-center items-center">
	<slot></slot>
</div>

<style lang="scss">
  :global(body) {
	@apply bg-base-200 w-screen h-screen;
  }
</style>
