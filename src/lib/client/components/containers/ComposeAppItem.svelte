<script lang="ts">
	import ContainerItem from './ContainerItem.svelte';
	import type {ComposeApp} from '$lib/client/stores/containers';

	import CalendarIcon from '$icons/calendar.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import RefreshIcon from '$icons/refresh.svg';
	import PauseIcon from '$icons/pause.svg';
	import PlayIcon from '$icons/play.svg';
	import TrashIcon from '$icons/trash.svg';
	import {removeContainer, restartContainer, startContainer, stopContainer} from '$lib/client/stores/containers';


	export let app:ComposeApp;

	let loading = false;

	$: running = app?.containers.every(c => c.state === 'running' || c.state === 'paused');
	$: stopped = app?.containers.every(c => c.state === 'created' || c.state === 'exited');


	const start = async () => {
		loading = true;
		for(const container of app.containers){
			if(container.state === 'created' || container.state === 'exited'){
				await startContainer(container.id);
			}
		}
		loading = false;
	};

	const restart = async () => {
		loading = true;
		for(const container of app.containers){
			if(container.state === 'running' || container.state === 'paused'){
				await restartContainer(container.id);
			}
		}
		loading = false;
	};

	const stop = async () => {
		loading = true;
		for(const container of app.containers){
			if(container.state === 'running' || container.state === 'paused'){
				await stopContainer(container.id);
			}
		}
		loading = false;
	};

	const remove = async () => {
		loading = true;
		for(const container of app.containers){
			if(container.state === 'created' || container.state === 'exited'){
				await removeContainer(container.id);
			}
		}
		loading = false;
	};


</script>

<div class="my-4 bg-neutral p-0 rounded-xl mx-[-1rem]">
	<div class="sticky top-[9.4rem] z-10 px-4 py-2 rounded-xl bg-neutral pb-3">
		<span class="text-xl font-bold ml-2 text-neutral-content">{app.name}</span>
		{#if stopped}
			<ActionButton icon={TrashIcon} loading={loading} on:click={remove} neutral="true" class="w-auto pr-3 h-8 btn-primary relative float-right ml-2">
				Remove
			</ActionButton>
		{/if}
		{#if running}
			<ActionButton icon={RefreshIcon} loading={loading} on:click={restart} neutral="true" class="w-auto pr-3 h-8 btn-primary relative float-right ml-2">
				Restart
			</ActionButton>
		{/if}
		{#if !stopped}
			<ActionButton icon={PauseIcon} loading={loading} on:click={stop} neutral="true" class="w-auto pr-3 h-8 btn-primary relative float-right ml-2">
				Stop
			</ActionButton>
		{/if}
		{#if !running}
			<ActionButton icon={PlayIcon} loading={loading} on:click={start} neutral="true" class="w-auto pr-3 h-8 relative float-right ml-2">
				Start
			</ActionButton>
		{/if}
		<div class="block h-7 w-auto float-right mb-0.5 tooltip tooltip-left text-neutral-content text-base font-bold mt-0.5 mr-4"
			 data-tip="Created">
			<CalendarIcon class="h-5 w-5 inline-block float-left mt-0.5 stroke-[2.5px]" xmlns="http://www.w3.org/2000/svg"/>
			<span class="inline-block float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-right">
				{new Date(app.created).toLocaleDateString()}
			</span>
		</div>
	</div>
	<div class="px-4 pb-1 mt-[-1rem]">
	{#each app.containers as container}
		<ContainerItem {container} forceLoading={loading}/>
	{/each}
	</div>
</div>

<style lang="scss">

</style>
