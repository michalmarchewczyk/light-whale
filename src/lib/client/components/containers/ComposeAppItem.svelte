<script lang="ts">
	import ContainerItem from './ContainerItem.svelte';
	import type {ComposeApp} from '$lib/client/stores/containers';

	import CalendarIcon from '$icons/calendar.svg';

	export let app:ComposeApp;
</script>

<div class="my-4 bg-neutral p-0 rounded-xl mx-[-1rem]">
	<div class="sticky top-[9.4rem] z-10 px-4 py-2 rounded-xl bg-neutral">
		<span class="text-xl font-bold ml-2 text-neutral-content">{app.name}</span>
		<div class="block h-7 w-auto float-right mb-0.5 tooltip tooltip-left text-neutral-content text-base font-bold mt-0.5"
			 data-tip="Created">
			<CalendarIcon class="h-5 w-5 inline-block float-left mt-1 stroke-[2.5px]" xmlns="http://www.w3.org/2000/svg"/>
			<span class="inline-block float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-right">
			{new Date(app.created).toLocaleDateString()}
		</span>
		</div>
	</div>
	<div class="px-4 pb-1 mt-[-0.5rem]">
	{#each app.containers as container}
		<ContainerItem {container}/>
	{/each}
	</div>
</div>

<style lang="scss">

</style>
