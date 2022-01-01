<script lang="ts">
	import ContainerItem from './_ContainerItem.svelte';
	import type {ComposeApp} from '$lib/stores/containers';

	import CalendarIcon from '$icons/calendar.svg';

	export let app:ComposeApp;
</script>

<div class="my-4 bg-neutral p-1 px-4 rounded-xl mx-[-1rem]">
	<span class="text-xl font-bold ml-2 text-neutral-content">{app.name}</span>
	<div class="block h-7 w-auto float-right mb-0.5 tooltip tooltip-left text-neutral-content text-base font-bold mt-0.5"
		 data-tip="Created">
		<CalendarIcon xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block float-left mt-1 stroke-[2.5px]"/>
		<span class="inline-block float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-right">
			{new Date(app.created).toLocaleDateString()}
		</span>
	</div>
	{#each app.containers as container}
		<ContainerItem {container}/>
	{/each}
</div>

<style lang="scss">

</style>
