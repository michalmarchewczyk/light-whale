<script lang="ts">
	import {goto} from '$app/navigation';
	import {session} from '$app/stores';
	import {fetchDockerAvailable} from '$lib/stores/docker';
	import {onMount} from 'svelte';

	export let drawerOpen = false;

	const changeDrawerOpen = () => {
		drawerOpen = !drawerOpen;
	};

	const logout = async () => {
		const res = await fetch('/login/logout');
		if (res.status === 200) {
			$session = {};
			await goto('/login');
		}
	};

	onMount(() => {
		const pingInterval = setInterval(async () => {
			await fetchDockerAvailable();
		}, 1000);
		return () => {
			clearInterval(pingInterval);
		};
	});

</script>
<div class="navbar bg-primary text-neutral-content shadow-b-xl">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost lg:hidden" on:click={changeDrawerOpen}>
			{#if drawerOpen}
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
					 stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						  d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
					 stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
				</svg>
			{/if}
		</button>
	</div>
	<div class="flex-1 px-2 mx-2">
		<span class="text-lg font-bold">
			Docker Control Panel
		</span>
	</div>
	<div class="flex-none">
		<button class="btn btn-square btn-ghost lg:hidden" on:click={logout}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
			</svg>
		</button>
	</div>
</div>
