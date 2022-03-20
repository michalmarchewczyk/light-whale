<script lang="ts">
	import {goto} from '$app/navigation';
	import {session} from '$app/stores';
	import {forceUpdateEverything, updateEverything} from '$lib/client/stores/docker';
	import {onMount} from 'svelte';

	import MenuIcon from '$icons/menu.svg';
	import ArrowLeftIcon from '$icons/arrow-left.svg';
	import RefreshIcon from '$icons/refresh.svg';
	import LogoutIcon from '$icons/logout.svg';

	import Logotype from '$lib/client/assets/logotype_white.png';

	export let drawerOpen = false;

	const changeDrawerOpen = () => {
		drawerOpen = !drawerOpen;
	};

	const logout = async () => {
		const res = await fetch('/api/auth/logout');
		if (res.status === 200) {
			$session = {};
			await goto('/login');
		}
	};

	onMount(() => {
		let ready = true;
		const updateInterval = setInterval(async () => {
			if (!ready) return;
			ready = false;
			await updateEverything();
			ready = true;
		}, 400);
		const forceUpdateInterval = setInterval(async () => {
			if (!ready) return;
			ready = false;
			await forceUpdateEverything();
			ready = true;
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
<div class="navbar bg-navbar text-primary-content shadow-b-xl z-50">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost lg:hidden" on:click={changeDrawerOpen}>
			{#if drawerOpen}
				<ArrowLeftIcon class="h-6 w-6 stroke-2"/>
			{:else}
				<MenuIcon class="h-6 w-6 stroke-2"/>
			{/if}
		</button>
	</div>
	<div class="flex-1 mx-2 ml-2 lg:ml-0">
		<img src={Logotype} class="h-14 absolute top-1" alt="Light-Whale"/>
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

<style lang="scss">
  .bg-navbar {
	background: #0c5bf7;
	background: linear-gradient(90deg, #0c5bf7 0%, #0a28bf 100%);
  }

  :global([data-theme='default-dark']) .bg-navbar {
	background: #256cfa;
	background: linear-gradient(90deg, #256cfa 0%, rgb(31, 59, 204) 100%);
  }
</style>
