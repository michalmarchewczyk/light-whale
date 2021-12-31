<script lang="ts">
	import {goto} from '$app/navigation';
	import {session} from '$app/stores';
	import {forceUpdateEverything, updateEverything} from '$lib/stores/docker';
	import {onMount} from 'svelte';

	import MenuIcon from '$icons/menu.svg';
	import ArrowLeftIcon from '$icons/arrow-left.svg';
	import RefreshIcon from '$icons/refresh.svg';
	import LogoutIcon from '$icons/logout.svg';

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
		const updateInterval = setInterval(async () => {
			await updateEverything();
		}, 400);
		const forceUpdateInterval = setInterval(async () => {
			await forceUpdateEverything();
		}, 30000);
		return () => {
			clearInterval(updateInterval);
			clearInterval(forceUpdateInterval);
		};
	});

	const refresh = async () => {
		await forceUpdateEverything();
	};

</script>
<div class="navbar bg-primary text-neutral-content shadow-b-xl z-50">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost lg:hidden" on:click={changeDrawerOpen}>
			{#if drawerOpen}
				<ArrowLeftIcon class="h-6 w-6 stroke-2"/>
			{:else}
				<MenuIcon class="h-6 w-6 stroke-2"/>
			{/if}
		</button>
	</div>
	<div class="flex-1 px-2 mx-2">
		<span class="text-lg font-bold">
			Docker Control Panel
		</span>
	</div>
	<div class="flex-none">
		<button class="btn btn-square btn-ghost mr-2" on:click={refresh}>
			<RefreshIcon class="h-6 w-6 stroke-2"/>
		</button>
		<button class="btn btn-square btn-ghost" on:click={logout}>
			<LogoutIcon class="h-6 w-6 stroke-2"/>
		</button>
	</div>
</div>
