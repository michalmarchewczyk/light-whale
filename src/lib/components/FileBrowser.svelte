<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	import FolderIcon from '$icons/folder-open.svg';
	import DocumentIcon from '$icons/document.svg';

	export let path = '';
	export let loading = true;
	export let files = [];

	const dispatch = createEventDispatcher();

</script>
<div class="card shadow-md bg-base-100 p-2">
	<span class="mx-2 p-1 font-bold text-lg pb-2 border-b-2 mb-2">{path}</span>
	{#if loading}
		<p class="p-6 text-xl text-center">Loading...</p>
	{:else}
		<ul class="menu p-0 compact">
			{#each files as file}
				<li>
					<button
						class="btn btn-ghost normal-case text-base text-left justify-start h-6 min-h-8 items-center no-animation"
						on:click={() => {dispatch('open', file);}}>
						{#if file.directory}
							<FolderIcon class="w-6 h-6 mr-2 stroke-2 opacity-80"/>
						{:else}
							<DocumentIcon class="w-6 h-6 mr-2 stroke-2 opacity-80"/>
						{/if}
						<span class="leading-7 self-start font-normal flex-1">{file.name}</span>
						<span class="leading-7 self-start font-normal opacity-50">{file.date}</span>
					</button>
				</li>
			{:else}
				<p class="p-6 text-xl text-center">Couldn't load files</p>
			{/each}
		</ul>
	{/if}
</div>
