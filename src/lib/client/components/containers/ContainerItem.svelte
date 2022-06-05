<script lang="ts">
	import type {Container} from '$lib/client/stores/containers';
	import {removeContainer, restartContainer, startContainer, stopContainer} from '$lib/client/stores/containers';

	import RefreshIcon from '$icons/refresh.svg';
	import PauseIcon from '$icons/pause.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import DiscIcon from '$lib/client/assets/icons/disc.svg';
	import TerminalIcon from '$icons/terminal.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import type {Image} from '$lib/client/stores/images';
	import {images} from '$lib/client/stores/images';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import ContainerStateIcon from '$lib/client/components/containers/ContainerStateIcon.svelte';

	export let container:Container;
	export let forceLoading = false;

	let image:Image;

	$: image = $images.find(i => i.id === container.imageId);

	let loading = false;

	let removeModal = false;

	const start = async () => {
		loading = true;
		await startContainer(container.id);
		loading = false;
	};
	const stop = async () => {
		loading = true;
		await stopContainer(container.id);
		loading = false;
	};
	const restart = async () => {
		loading = true;
		await restartContainer(container.id);
		loading = false;
	};

	const remove = async () => {
		loading = true;
		await removeContainer(container.id);
		loading = false;
	};
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-28 overflow-hidden">
	<ContainerStateIcon state="{container?.state}" class="flex-shrink-0"/>
	<a class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	   href="/containers/{container.names[0].substring(1)}">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{container.names.map(n => n.substring(1)).join(', ')}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5">ID: {container.id}</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-0.5">{container.status}</span>
	</a>
	<div class="block w-52 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4">
		<ItemInfo icon={CalendarIcon}>
			{new Date(container.created).toLocaleDateString()}
		</ItemInfo>
		<a href="/images/{image?.id.substring(7, 19)}" class="hover:text-primary-focus">
			<ItemInfo icon={DiscIcon}>
				{image?.tags.join(',')}
			</ItemInfo>
		</a>
		<ItemInfo icon={TerminalIcon}>
			{container.command}
		</ItemInfo>
	</div>
	<div class="block w-32 overflow-hidden flex-shrink-0">
		{#if container.state === 'created' || container.state === 'exited'}
			<ActionButton icon={PlayIcon} loading={loading || forceLoading} on:click={start} class="w-32 h-10">
				Start
			</ActionButton>
			<ActionButton icon={TrashIcon} loading={loading || forceLoading} on:click={() => removeModal = true} class="w-32 h-10 mt-2">
				Remove
			</ActionButton>
			<RemoveModal label="container" name="{container?.name}" remove={remove} bind:open={removeModal}/>
		{/if}
		{#if container.state === 'running' || container.state === 'paused'}
			<ActionButton icon={PauseIcon} loading={loading || forceLoading} on:click={stop} class="w-32 h-10">
				Stop
			</ActionButton>
			<ActionButton icon={RefreshIcon} loading={loading || forceLoading} on:click={restart} class="w-32 h-10 mt-2">
				Restart
			</ActionButton>
		{/if}
	</div>
</div>
