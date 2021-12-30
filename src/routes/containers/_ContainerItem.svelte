<script lang="ts">
	import type {Container} from '$lib/stores/docker';
	import {startContainer, stopContainer, restartContainer, removeContainer} from '$lib/stores/docker';

	export let container:Container;
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
	<div class="mx-3 w-16 sm:w-24  flex-shrink-0"
		 class:text-info={container.state === 'created'}
		 class:text-success={container.state === 'running'}
		 class:text-warning={container.state === 'paused' || container.state === 'restarting'}
		 class:text-error={container.state === 'dead' || container.state === 'removing'}
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
			{#if container.state === 'created'}
				<path stroke-linecap="round" stroke-linejoin="round"
					  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
			{:else if container.state === 'running'}
				<path stroke-linecap="round" stroke-linejoin="round"
					  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
			{:else if container.state === 'restarting'}
				<path stroke-linecap="round" stroke-linejoin="round"
					  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
			{:else if container.state === 'paused'}
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			{:else if container.state === 'exited'}
				<path stroke-linecap="round" stroke-linejoin="round"
					  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
			{:else if container.state === 'removing'}
				<path stroke-linecap="round" stroke-linejoin="round"
					  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
			{:else if container.state === 'dead'}
				<path stroke-linecap="round" stroke-linejoin="round"
					  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
			{/if}
		</svg>
		<span class="uppercase w-full text-center mt-1.5 block font-bold text-sm sm:text-base overflow-hidden overflow-ellipsis sm:overflow-visible">
			{container.state}
		</span>
	</div>
	<div class="block w-60 flex-auto w-60 overflow-hidden mr-3 pr-4">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{container.names.map(n => n.substring(1)).join(', ')}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5">ID: {container.id}</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-0.5">{container.status}</span>
	</div>
	<div class="block w-52 flex-auto overflow-visible mr-3">
		<div class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left" data-tip="Created">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block float-left mt-0.5" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{new Date(container.created).toLocaleDateString()}
			</span>
		</div>
		<div class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left" data-tip="Image">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block float-left mt-0.5" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
			</svg>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{container.imageName}
			</span>
		</div>
		<div class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left" data-tip="Command">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block float-left mt-0.5" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{container.command}
			</span>
		</div>
	</div>
	<div class="block w-32 overflow-hidden flex-shrink-0">
		{#if container.state === 'created' || container.state === 'exited'}
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2"
					on:click={start} class:loading={loading} disabled={loading}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
					 stroke="currentColor" class:hidden={loading} stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round"
						  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span class="mt-[-0.25rem]">Start</span>
			</button>
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2 mt-2"
					on:click={openRemoveModal} class:loading={loading} disabled={loading}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
					 stroke="currentColor" class:hidden={loading} stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round"
						  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
				<span class="mt-[-0.25rem]">Remove</span>
			</button>
			<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={removeModal}>
			<div class="modal">
				<div class="modal-box">
					<p>Do you really want to remove container
						<span class="font-bold">{container.names[0].substring(1)}</span>
						?
					</p>
					<div class="modal-action">
						<button class="btn btn-primary" on:click={remove}>Remove</button>
						<button class="btn" on:click={closeRemoveModal}>Cancel</button>
					</div>
				</div>
			</div>
		{/if}
		{#if container.state === 'running'}
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2"
					on:click={stop} class:loading={loading} disabled={loading}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" stroke-width="2"
					 viewBox="0 0 24 24" stroke="currentColor" class:hidden={loading}>
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span class="mt-[-0.25rem]">Stop</span>
			</button>
			<button class="btn btn-primary w-32 justify-start h-10 btn-block min-h-0 text-base px-2 mt-2"
					on:click={restart} class:loading={loading} disabled={loading}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
					 stroke="currentColor" class:hidden={loading} stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				<span class="mt-[-0.25rem]">Restart</span>
			</button>
		{/if}
	</div>
</div>

<style lang="scss">

</style>
