<script lang="ts">
	import type {Site} from '$lib/stores/sites';
	import {pauseSite, removeSite, unpauseSite} from '$lib/stores/sites';

	import StatusOnlineIcon from '$icons/status-online.svg';
	import StatusOfflineIcon from '$icons/status-offline.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import CubeIcon from '$icons/cube.svg';
	import CubeTransparentIcon from '$icons/cube-transparent.svg';
	import TrashIcon from '$icons/trash.svg';
	import PauseIcon from '$icons/pause.svg';
	import PlayIcon from '$icons/play.svg';
	import ExternalLinkIcon from '$icons/external-link.svg';
	import type {Container} from '$lib/stores/containers';
	import {containers} from '$lib/stores/containers';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import ItemInfo from '$lib/components/ItemInfo.svelte';
	import RemoveModal from '$lib/components/RemoveModal.svelte';

	export let site:Site;

	let loading = false;
	let removeModal = false;

	let container:Container;

	$: container = $containers?.find(c => c.id.startsWith(site?.containerId));

	let online:boolean;

	$: online = site?.paused === false && container?.state === 'running';

	const pause = async () => {
		loading = true;
		await pauseSite(site?.id);
		loading = false;
	};

	const unpause = async () => {
		loading = true;
		await unpauseSite(site?.id);
		loading = false;
	};

	const remove = async () => {
		loading = true;
		await removeSite(site?.id);
		loading = false;
	};

</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-[5.5rem] overflow-hidden">
	<div class="mx-1 sm:mx-2 w-16 sm:w-20 flex-shrink-0"
		 class:text-error={!online}
		 class:text-success={online}
		 class:text-warning={site?.paused}
	>
		{#if online}
			<StatusOnlineIcon class="w-8 h-8 sm:h-10 sm:w-10 mx-auto mt-0 stroke-[1.5px]"/>
		{:else}
			<StatusOfflineIcon class="w-8 h-8 sm:h-10 sm:w-10 mx-auto mt-0 stroke-[1.5px]"/>
		{/if}
		<span class="uppercase w-full text-center mt-1 block font-bold text-sm sm:text-base
		 overflow-hidden overflow-ellipsis sm:overflow-visible whitespace-nowrap">
			{site?.paused ? 'Disabled' : online ? 'Online' : 'Offline'}
		</span>
	</div>
	<a class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	   href="/sites/{site.domain}">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{site.domain}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5">ID: {site.id}</span>
	</a>
	<div class="block w-40 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={CalendarIcon}>
			{new Date(site.created ?? 0).toLocaleDateString()}
		</ItemInfo>
		{#if container}
			<a href='/containers/{container?.names[0].substring(1)}' class="hover:text-primary-focus block">
				<ItemInfo icon={container?.state === 'running' ? CubeIcon : CubeTransparentIcon}>
					{container?.names[0].substring(1) ?? ' - '}
				</ItemInfo>
			</a>
		{:else}
			<ItemInfo icon={CubeTransparentIcon} class="italic">
				not found
			</ItemInfo>
		{/if}
	</div>
	<div class="block w-28 md:w-64 overflow-hidden flex-shrink-0 self-center">
		{#if site?.paused}
			<ActionButton icon={PlayIcon} loading={loading} on:click={unpause} class="h-8 md:h-12 w-28 md:w-32 md:mr-2">
				Enable
			</ActionButton>
			<ActionButton icon={TrashIcon} loading={loading} on:click={() => removeModal = true} class="w-28 h-8 md:h-12 mt-1 md:mt-0">
				Delete
			</ActionButton>
			<RemoveModal label="site" name="{site?.domain}" remove={remove} bind:open={removeModal}/>
		{:else}
			<ActionButton icon={PauseIcon} loading={loading} on:click={pause} class="h-8 md:h-12 w-28 md:w-32">
				Disable
			</ActionButton>
			<a href="http://{site?.domain}" target="_blank"
			   class="btn btn-ghost w-28 justify-start h-8 md:h-12 btn-block min-h-0 text-base px-2 md:ml-2 mt-1 md:mt-0">
				<ExternalLinkIcon class="h-6 w-6 mr-2 stroke-2"/>
				<span class="mt-[-0.25rem]">Open</span>
			</a>
		{/if}

	</div>
</div>

<style lang="scss">

</style>
