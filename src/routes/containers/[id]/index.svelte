<script lang="ts">
	import {page} from '$app/stores';
	import {
		Container,
		containers,
		removeContainer,
		restartContainer,
		startContainer,
		stopContainer
	} from '$lib/stores/containers';
	import {goto} from '$app/navigation';

	import RefreshIcon from '$icons/refresh.svg';
	import PauseIcon from '$icons/pause.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import {Image, images} from '$lib/stores/images';

	let container:Container = null;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

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
		await goto('/containers');
	};

</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">State: {container?.state.toUpperCase()}</h2>
		<p>Status: {container?.status}</p>
		<div class="card-actions">
			<button class="btn btn-primary justify-start px-3 text-lg mr-3"
					on:click={start} class:loading={loading} disabled={loading || container?.state === 'running'}>
				{#if !loading}<PlayIcon class="h-6 w-6 mr-3 stroke-2"/>{/if}
				<span class="mt-0 mr-2">Start</span>
			</button>
			<button class="btn btn-primary justify-start px-3 text-lg mr-3"
					on:click={stop} class:loading={loading} disabled={loading || container?.state !== 'running'}>
				{#if !loading}<PauseIcon class="h-6 w-6 mr-3 stroke-2"/>{/if}
				<span class="mt-0 mr-2">Stop</span>
			</button>
			<button class="btn btn-primary justify-start px-3 text-lg mr-3"
					on:click={restart} class:loading={loading} disabled={loading || container?.state !== 'running'}>
				{#if !loading}<RefreshIcon class="h-6 w-6 mr-3 stroke-2"/>{/if}
				<span class="mt-0 mr-2">Restart</span>
			</button>
			<button class="btn btn-primary justify-start px-3 text-lg mr-3"
					on:click={openRemoveModal} class:loading={loading} disabled={loading || container?.state === 'running'}>
				{#if !loading}<TrashIcon class="h-6 w-6 mr-3 stroke-2"/>{/if}
				<span class="mt-0 mr-2">Remove</span>
			</button>
			<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={removeModal}>
			<div class="modal">
				<div class="modal-box">
					<p>Do you really want to remove container
						<span class="font-bold">{container?.names[0].substring(1)}</span> ?
					</p>
					<div class="modal-action">
						<button class="btn btn-primary" on:click={remove}>Remove</button>
						<button class="btn" on:click={closeRemoveModal}>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Information</h2>
		<p>
			Names({container?.names.length}):
			<span class="font-bold">{container?.names.map(n => n.substring(1)).join(', ')}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{container?.id}</span>
		</p>
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-6">
	<a href="/image/{image.id.substring(7, 19)}" class="card-body p-6 pt-5 hover:text-primary-focus">
		<h2 class="card-title text-xl">Image</h2>
		<p>
			Name:
			<span class="font-bold">{image.tags.join(',')}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{container?.imageId}</span>
		</p>
	</a>
</div>

<style lang="scss">

</style>
