<script lang="ts">
	import type {ComposeApp} from '$lib/stores/docker';
	import ContainerItem from './_ContainerItem.svelte';

	export let app:ComposeApp;
</script>

<div class="my-4 bg-neutral p-1 px-4 rounded-xl mx-[-1rem]">
	<span class="text-xl font-bold ml-2 text-neutral-content">{app.name}</span>
	<div class="block h-7 w-auto float-right mb-0.5 tooltip tooltip-left text-neutral-content text-base font-bold mt-0.5" data-tip="Created">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block float-left mt-1" fill="none" viewBox="0 0 24 24"
			 stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
				  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
		</svg>
		<span class="inline-block float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-right">
				{new Date(app.created).toLocaleDateString()}
			</span>
	</div>
	{#each app.containers as container}
		<ContainerItem key={container.id} {container}/>
	{/each}
</div>

<style lang="scss">

</style>
