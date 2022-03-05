<script lang="ts">
	import {onMount} from 'svelte';
	import {fetchImages} from '$lib/client/stores/images';
	import {fetchContainers} from '$lib/client/stores/containers';
	import {fetchSites} from '$lib/client/stores/sites';
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import PageMenu from '$lib/client/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/client/components/page/PageMenuItem.svelte';

	import CogIcon from '$icons/cog.svg';

	onMount(async () => {
		await fetchSites();
		await fetchImages();
		await fetchContainers();
	});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<PageHeader>
		Settings
	</PageHeader>
	<PageMenu>
		<PageMenuItem path="/settings" icon={CogIcon}>
			General
		</PageMenuItem>
	</PageMenu>

	<div class="mx-4 mt-8 mb-8">
		<slot></slot>
	</div>
</div>

<style lang="scss">

</style>
