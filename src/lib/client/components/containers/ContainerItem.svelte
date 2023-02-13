<script lang="ts">
	import ContainerStateIcon from '$lib/client/components/containers/ContainerStateIcon.svelte';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';

	import RefreshIcon from '$icons/arrow-path.svg';
	import PauseIcon from '$icons/pause.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import DiscIcon from '$lib/client/assets/icons/disc.svg';
	import CommandLineIcon from '$icons/command-line.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import type ContainerData from '$lib/server/docker/ContainerData';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import { enhance } from '$app/forms';

	export let container: ContainerData;
	let loading = false;

	export let forceLoading = false;

	let removeModal = false;
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-28 overflow-hidden">
	<ContainerStateIcon state={container?.state} class="flex-shrink-0" />
	<a
		class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
		href="/containers/{container.name.substring(1)}"
	>
		<span
			class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl"
		>
			{container.name.substring(1)}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5"
			>ID: {container.id}</span
		>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-0.5"
			>{container.status}</span
		>
	</a>
	<div class="block w-52 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4">
		<ItemInfo icon={CalendarIcon}>
			{new Date(container.created).toLocaleDateString()}
		</ItemInfo>
		<!--		<a href="/images/{image?.id.substring(7, 19)}" class="hover:text-primary-focus">-->
		<!--			<ItemInfo icon={DiscIcon}>-->
		<!--				{image?.tags.join(',')}-->
		<!--			</ItemInfo>-->
		<!--		</a>-->
		<ItemInfo icon={CommandLineIcon}>
			{container.command}
		</ItemInfo>
	</div>
	<form
		class="block w-32 overflow-hidden flex-shrink-0"
		method="POST"
		use:enhance={() => {
			loading = true;
			return ({ update }) => {
				loading = false;
				update();
			};
		}}
	>
		{#if container.state === 'created' || container.state === 'exited'}
			<ActionButton
				icon={PlayIcon}
				loading={loading || forceLoading}
				class="w-32 h-10"
				formaction="/containers/{container.id}?/start">Start</ActionButton
			>
			<ActionButton
				icon={TrashIcon}
				loading={loading || forceLoading}
				on:click={() => (removeModal = true)}
				type="button"
				class="w-32 h-10 mt-2"
			>
				Remove
			</ActionButton>
			<RemoveModal
				label="container"
				name={container.name.substring(1)}
				bind:open={removeModal}
				formaction="/containers/{container.id}?/remove"
			/>
		{/if}
		{#if container.state === 'running' || container.state === 'paused'}
			<ActionButton
				icon={PauseIcon}
				loading={loading || forceLoading}
				formaction="/containers/{container.id}?/stop"
				class="w-32 h-10">Stop</ActionButton
			>
			<ActionButton
				icon={RefreshIcon}
				loading={loading || forceLoading}
				formaction="/containers/{container.id}?/restart"
				class="w-32 h-10 mt-2">Restart</ActionButton
			>
		{/if}
	</form>
</div>
