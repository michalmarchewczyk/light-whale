<script lang="ts">
	import CalendarIcon from '$icons/calendar.svg';
	import CubeIcon from '$icons/cube.svg';
	import CubeTransparentIcon from '$icons/cube-transparent.svg';
	import TrashIcon from '$icons/trash.svg';
	import PauseIcon from '$icons/pause.svg';
	import PlayIcon from '$icons/play.svg';
	import ExternalLinkIcon from '$icons/arrow-top-right-on-square.svg';
	import SiteStatusIcon from '$lib/client/components/sites/SiteStatusIcon.svelte';
	import type ContainerData from '$lib/server/docker/ContainerData';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import type SiteData from '$lib/server/sites/SiteData';
	import { enhance } from '$app/forms';

	export let site: SiteData;

	export let container: ContainerData;

	$: online = !site?.paused && container?.state === 'running';

	let loading = false;

	let removeModal = false;
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-[5.5rem] overflow-hidden">
	<SiteStatusIcon status={site.paused ? 'paused' : online ? 'online' : 'offline'} />
	<a
		class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
		href="/sites/{site.domain}"
	>
		<span
			class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl"
		>
			{site.domain}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5"
			>ID: {site.id}</span
		>
	</a>
	<div class="block w-40 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={CalendarIcon}>
			{new Date(site.created ?? 0).toLocaleDateString()}
		</ItemInfo>
		{#if container}
			<a href="/containers/{container?.name.substring(1)}" class="hover:text-primary-focus block">
				<ItemInfo icon={container?.state === 'running' ? CubeIcon : CubeTransparentIcon}>
					{container?.name.substring(1) ?? ' - '}
				</ItemInfo>
			</a>
		{:else}
			<ItemInfo icon={CubeTransparentIcon} class="italic">not found</ItemInfo>
		{/if}
	</div>
	<form
		class="block w-28 md:w-64 overflow-visible flex-shrink-0 self-center"
		method="POST"
		use:enhance={() => {
			loading = true;
			return ({ update }) => {
				loading = false;
				update();
			};
		}}
	>
		{#if site?.paused}
			<ActionButton
				icon={PlayIcon}
				{loading}
				class="h-8 md:h-12 w-28 md:w-32 md:mr-2"
				formaction="/sites/{site.domain}?/unpause"
			>
				Enable
			</ActionButton>
			<ActionButton
				icon={TrashIcon}
				{loading}
				on:click={() => (removeModal = true)}
				class="w-28 h-8 md:h-12 mt-1 md:mt-0"
				type="button"
			>
				Delete
			</ActionButton>
			<RemoveModal
				label="site"
				name={site.domain}
				bind:open={removeModal}
				formaction="/sites/{site.domain}?/remove"
			/>
		{:else}
			<ActionButton
				icon={PauseIcon}
				{loading}
				class="h-8 md:h-12 w-28 md:w-32"
				formaction="/sites/{site.domain}?/pause"
			>
				Disable
			</ActionButton>
			<a
				href="http://{site.domain}"
				target="_blank"
				rel="noreferrer"
				class="btn btn-ghost w-28 justify-start h-8 md:h-12 btn-block min-h-0 text-base px-2 md:ml-2 mt-1 md:mt-0"
			>
				<ExternalLinkIcon class="h-6 w-6 mr-2 stroke-2" />
				<span class="mt-[-0.25rem]">Open</span>
			</a>
		{/if}
	</form>
</div>
