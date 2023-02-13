<script lang="ts">
	import MenuIcon from '$icons/bars-3.svg';
	import ArrowLeftIcon from '$icons/arrow-left.svg';
	import LogoutIcon from '$icons/arrow-right-on-rectangle.svg';
	import Logotype from '$lib/client/assets/logotype_white.png';

	export let drawerOpen = false;
	const changeDrawerOpen = () => {
		drawerOpen = !drawerOpen;
	};
</script>

<div class="navbar bg-navbar text-primary-content shadow-b-xl z-50">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost lg:hidden" on:click={changeDrawerOpen}>
			{#if drawerOpen}
				<ArrowLeftIcon class="h-6 w-6 stroke-2" />
			{:else}
				<MenuIcon class="h-6 w-6 stroke-2" />
			{/if}
		</button>
	</div>
	<div class="flex-1 mx-2 ml-2 lg:ml-0">
		<img src={Logotype} class="h-14 absolute top-1" alt="Light-Whale" />
	</div>
	<div class="flex-none">
		<a class="btn btn-square btn-ghost" href="/logout" data-sveltekit-preload-data="tap">
			<LogoutIcon class="h-6 w-6 stroke-2" />
		</a>
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
