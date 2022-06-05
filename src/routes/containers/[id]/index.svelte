<script lang="ts">
	import {page} from '$app/stores';
	import type {
		Container} from '$lib/client/stores/containers';
	import {
		containers,
		removeContainer,
		restartContainer,
		startContainer,
		stopContainer
	} from '$lib/client/stores/containers';
	import {goto} from '$app/navigation';

	import RefreshIcon from '$icons/refresh.svg';
	import PauseIcon from '$icons/pause.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import type {Image} from '$lib/client/stores/images';
	import { images} from '$lib/client/stores/images';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';

	let container:Container = null;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	let image:Image;

	$: image = $images.find(i => i.id === container?.imageId);

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
		await goto('/containers');
	};

</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">State: {container?.state.toUpperCase()}</h2>
		<p>Status: {container?.status}</p>
		<div class="card-actions mt-2">
			<ActionButton icon={PlayIcon} on:click={start} loading={loading} disabled={container?.state === 'running'}
				class="w-auto px-3">
				Start
			</ActionButton>
			<ActionButton icon={PauseIcon} on:click={stop} loading={loading} disabled={container?.state !== 'running'}
						  class="w-auto px-3">
				Stop
			</ActionButton>
			<ActionButton icon={RefreshIcon} on:click={restart} loading={loading} disabled={container?.state !== 'running'}
						  class="w-auto px-3">
				Restart
			</ActionButton>
			<ActionButton icon={TrashIcon} on:click={() => removeModal = true} loading={loading} disabled={container?.state === 'running'}
						  class="w-auto px-3">
				Remove
			</ActionButton>
			<RemoveModal label="container" name="{container?.name}" remove={remove} bind:open={removeModal}/>
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
		<p>
			Short ID:
			<span class="font-bold">{container?.id.substring(0, 12)}</span>
		</p>
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-6">
	<a class="card-body p-6 pt-5 hover:text-primary-focus" href="/images/{image?.id.substring(7, 19)}">
		<h2 class="card-title text-xl">Image</h2>
		<p>
			Name:
			<span class="font-bold">{image?.tags.join(',')}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{container?.imageId}</span>
		</p>
	</a>
</div>

<style lang="scss">

</style>
