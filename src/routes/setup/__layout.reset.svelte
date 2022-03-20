<script context="module" lang="ts">
	import type {Load} from '@sveltejs/kit';

	const load:Load = async ({fetch}) => {
		const res = await fetch('/api/setup/check');
		const isSetup = await res.text();
		if(isSetup !== 'false'){
			return {
				status: 302,
				redirect: '/login'
			};
		}
		const res2 = await fetch('/api/setup/getSystem');
		if(res2.status !== 200){
			return {
				stuff: {}
			};
		}
		const system = await res2.text();
		return {
			stuff: {
				system,
			}
		};
	};

	export {
		load
	};
</script>

<script lang="ts">
	import Background from '$lib/client/assets/background.svg';
	import Logotype from '$lib/client/assets/logotype_white.png';
	import {page} from '$app/stores';
</script>

<svelte:head>
	<title>Light-Whale</title>
</svelte:head>

<div class="fixed top-0 left-0 h-screen w-screen">
	<Background class="absolute top-0 left-0 h-5/6 w-auto"/>
	<img src={Logotype} class="absolute h-20 w-auto top-8 left-8" alt="Light-Whale"/>
	<span class="absolute bottom-0 right-0 text-base font-semibold opacity-40 p-4">{$page.stuff?.system ?? '-'}</span>
</div>
<div class="flex w-screen h-screen justify-center items-center p-8">
	<slot></slot>
</div>

<style lang="scss">
  :global(body) {
	@apply bg-base-200 w-screen h-screen;
  }
</style>
