<script lang="ts">
	import {Container, removeContainer, restartContainer, startContainer, stopContainer} from '$lib/stores/containers';

	import CubeIcon from '$icons/cube.svg';
	import CubeTransparentIcon from '$icons/cube-transparent.svg';
	import RefreshIcon from '$icons/refresh.svg';
	import PauseIcon from '$icons/pause.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import DiscIcon from '$lib/assets/icons/disc.svg';
	import TerminalIcon from '$icons/terminal.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import {Image, images} from '$lib/stores/images';

	export let container:Container;

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

	const openRemoveModal = () => {
		removeModal = true;
	};

	const closeRemoveModal = () => {
		removeModal = false;
	};

	const remove = async () => {
		removeModal = false;
		loading = true;
		await removeContainer(container.id);
		loading = false;
	};
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-28 overflow-hidden">
	<div class="mx-2 sm:mx-3 w-16 sm:w-24 flex-shrink-0"
		 class:text-error={container.state === 'dead' || container.state === 'removing'}
		 class:text-info={container.state === 'created'}
		 class:text-success={container.state === 'running'}
		 class:text-warning={container.state === 'paused' || container.state === 'restarting'}
	>
		{#if container.state === 'created'}
			<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]"/>
		{:else if container.state === 'running'}
			<CubeIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]"/>
		{:else if container.state === 'restarting'}
			<RefreshIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]"/>
		{:else if container.state === 'paused'}
			<PauseIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]"/>
		{:else if container.state === 'exited'}
			<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]"/>
		{:else if container.state === 'removing'}
			<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]"/>
		{:else if container.state === 'dead'}
			<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]"/>
		{/if}
		<span class="uppercase w-full text-center mt-1.5 block font-bold text-sm sm:text-base overflow-hidden overflow-ellipsis sm:overflow-visible">
			{container.state}
		</span>
	</div>
	<a class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	   href="/containers/{container.names[0].substring(1)}">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{container.names.map(n => n.substring(1)).join(', ')}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5">ID: {container.id}</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-0.5">{container.status}</span>
	</a>
	<div class="block w-52 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4">
		<div class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left" data-tip="Created">
			<CalendarIcon class="h-6 w-6 inline-block float-left mt-0.5 stroke-2"/>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{new Date(container.created).toLocaleDateString()}
			</span>
		</div>
		<a href="/images/{image?.id.substring(7, 19)}"
		   class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left hover:text-primary-focus" data-tip="Image">
			<DiscIcon class="h-6 w-6 inline-block float-left mt-0.5 stroke-2"/>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{image?.tags.join(',')}
			</span>
		</a>
		<div class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left" data-tip="Command">
			<TerminalIcon class="h-6 w-6 inline-block float-left mt-0.5 stroke-2"/>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{container.command}
			</span>
		</div>
	</div>
	<div class="block w-32 overflow-hidden flex-shrink-0">
		{#if container.state === 'created' || container.state === 'exited'}
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2"
					on:click={start} class:loading={loading} disabled={loading}>
				{#if !loading}
					<PlayIcon class="h-6 w-6 mr-2 stroke-2"/>
				{/if}
				<span class="mt-[-0.25rem]">Start</span>
			</button>
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2 mt-2"
					on:click={openRemoveModal} class:loading={loading} disabled={loading}>
				{#if !loading}
					<TrashIcon class="h-6 w-6 mr-2 stroke-2"/>
				{/if}
				<span class="mt-[-0.25rem]">Remove</span>
			</button>
			<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={removeModal}>
			<div class="modal">
				<div class="modal-box">
					<p>Do you really want to remove container
						<span class="font-bold">{container.names[0].substring(1)}</span> ?
					</p>
					<div class="modal-action">
						<button class="btn btn-primary" on:click={remove}>Remove</button>
						<button class="btn" on:click={closeRemoveModal}>Cancel</button>
					</div>
				</div>
			</div>
		{/if}
		{#if container.state === 'running' || container.state === 'paused'}
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2"
					on:click={stop} class:loading={loading} disabled={loading}>
				{#if !loading}
					<PauseIcon class="h-6 w-6 mr-2 stroke-2"/>
				{/if}
				<span class="mt-[-0.25rem]">Stop</span>
			</button>
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2 mt-2"
					on:click={restart} class:loading={loading} disabled={loading}>
				{#if !loading}
					<RefreshIcon class="h-6 w-6 mr-2 stroke-2"/>
				{/if}
				<span class="mt-[-0.25rem]">Restart</span>
			</button>
		{/if}
	</div>
</div>

<style lang="scss">

</style>
