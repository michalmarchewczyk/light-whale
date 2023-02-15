<script lang="ts">
	import RefreshIcon from '$icons/arrow-path.svg';
	import PauseIcon from '$icons/pause.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import type ContainerData from '$lib/server/docker/ContainerData';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import { enhance } from '$app/forms';

	export let data: { container: ContainerData };

	let loading = false;
	let removeModal = false;
</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">State: {data.container?.state.toUpperCase()}</h2>
		<p>Status: {data.container?.status}</p>
		<form
			class="card-actions mt-2"
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<ActionButton
				icon={PlayIcon}
				{loading}
				disabled={data.container?.state === 'running'}
				class="w-auto px-3"
				formaction="?/start"
			>
				Start
			</ActionButton>
			<ActionButton
				icon={PauseIcon}
				{loading}
				disabled={data.container?.state !== 'running'}
				class="w-auto px-3"
				formaction="?/stop"
			>
				Stop
			</ActionButton>
			<ActionButton
				icon={RefreshIcon}
				{loading}
				disabled={data.container?.state !== 'running'}
				class="w-auto px-3"
				formaction="?/restart"
			>
				Restart
			</ActionButton>
			<ActionButton
				icon={TrashIcon}
				on:click={() => (removeModal = true)}
				{loading}
				disabled={data.container?.state === 'running'}
				class="w-auto px-3"
				type="button"
			>
				Remove
			</ActionButton>
			<RemoveModal
				label="container"
				name={data.container?.name}
				formaction="?/remove"
				bind:open={removeModal}
			/>
		</form>
	</div>
</div>
<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Information</h2>
		<p>
			Name:
			<span class="font-bold">{data.container?.name.substring(1)}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{data.container?.id}</span>
		</p>
		<p>
			Short ID:
			<span class="font-bold">{data.container?.id.substring(0, 12)}</span>
		</p>
	</div>
</div>
<div class="card shadow-md bg-base-100 mb-6">
	<a
		class="card-body p-6 pt-5 hover:text-primary-focus"
		href="/images/{data.container.imageId.substring(7, 19)}"
	>
		<h2 class="card-title text-xl">Image</h2>
		<!--		<p>-->
		<!--			Name:-->
		<!--			<span class="font-bold">{image?.tags.join(',')}</span>-->
		<!--		</p>-->
		<p>
			ID:
			<span class="font-bold">{data.container?.imageId}</span>
		</p>
	</a>
</div>
