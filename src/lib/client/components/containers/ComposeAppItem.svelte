<script lang="ts">
	import ContainerItem from '$lib/client/components/containers/ContainerItem.svelte';
	import type { ComposeAppData } from '../../../../routes/(app)/containers/+page.server';
	import CalendarIcon from '$icons/calendar.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import RefreshIcon from '$icons/arrow-path.svg';
	import PauseIcon from '$icons/pause.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import { enhance } from '$app/forms';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';

	export let app: ComposeAppData;

	let loading = false;

	let removeModal = false;

	$: running = app?.containers.every((c) => c.state === 'running' || c.state === 'paused');
	$: stopped = app?.containers.every((c) => c.state === 'created' || c.state === 'exited');
</script>

<form
	class="my-4 bg-neutral p-0 rounded-xl mx-[-1rem]"
	method="POST"
	use:enhance={() => {
		loading = true;
		return ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<div class="sticky top-[8.6rem] z-10 px-4 py-2 rounded-xl bg-neutral pb-3">
		<span class="text-xl font-bold ml-2 text-neutral-content">{app.name}</span>
		{#if stopped}
			<ActionButton
				icon={TrashIcon}
				{loading}
				neutral="true"
				class="w-auto pr-3 h-8 btn-primary relative float-right ml-2"
				type="button"
				on:click={() => (removeModal = true)}
			>
				Remove
			</ActionButton>
			<RemoveModal
				label="app"
				name={app.name}
				bind:open={removeModal}
				formaction="/containers?/remove"
			/>
		{/if}
		{#if running}
			<ActionButton
				icon={RefreshIcon}
				{loading}
				neutral="true"
				class="w-auto pr-3 h-8 btn-primary relative float-right ml-2"
				formaction="/containers?/restart"
			>
				Restart
			</ActionButton>
		{/if}
		{#if !stopped}
			<ActionButton
				icon={PauseIcon}
				{loading}
				neutral="true"
				class="w-auto pr-3 h-8 btn-primary relative float-right ml-2"
				formaction="/containers?/stop"
			>
				Stop
			</ActionButton>
		{/if}
		{#if !running}
			<ActionButton
				icon={PlayIcon}
				{loading}
				neutral="true"
				class="w-auto pr-3 h-8 relative float-right ml-2"
				formaction="/containers?/start"
			>
				Start
			</ActionButton>
		{/if}
		<div
			class="block h-7 w-auto float-right mb-0.5 tooltip tooltip-left text-neutral-content text-base font-bold mt-0.5 mr-4"
			data-tip="Created"
		>
			<CalendarIcon
				class="h-5 w-5 inline-block float-left mt-0.5 stroke-[2.5px]"
				xmlns="http://www.w3.org/2000/svg"
			/>
			<span
				class="inline-block float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-right"
			>
				{new Date(app.created).toLocaleDateString()}
			</span>
		</div>
	</div>
	<div class="px-4 pb-1 mt-[-1rem]">
		{#each app.containers as container}
			<input type="hidden" name="containers" value={container.id} />
			<ContainerItem {container} forceLoading={loading} />
		{/each}
	</div>
</form>
