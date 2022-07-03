<script lang="ts">
	import {createEventDispatcher} from 'svelte';
	import hljs from 'highlight.js';

	import FolderIcon from '$icons/folder-open.svg';
	import DocumentIcon from '$icons/document.svg';
	import ArrowLeftIcon from '$icons/arrow-left.svg';
	import {theme} from '$lib/client/stores/settings.js';

	export let path = '';
	export let loading = true;
	export let files = [];
	export let file = '';

	const dispatch = createEventDispatcher();

	let highlightedCode = '';
	$: {
		highlightedCode = hljs.highlightAuto(file).value;
	}

</script>

<div class="card shadow-md bg-base-100 p-0 max-h-[calc(100vh-18rem)] overflow-hidden">
	<span class="mx-0 p-2 px-5 font-bold text-lg border-b-2 mb-0">
		{#if file}
			<button class="btn btn-ghost min-h-0 h-9 w-9 px-1.5 mr-4 relative float-left inline-block align-middle"
					on:click={() => file = ''}>
				<ArrowLeftIcon class="w-6 h-6 stroke-2"/>
			</button>
		{/if}
		<span class="block py-1">
			{path}
		</span>
	</span>
	{#if loading}
		<p class="p-6 text-xl text-center">Loading...</p>
	{:else}
		{#if file}
			<div class="px-6 py-4 overflow-scroll">
				{#if $theme === 'default-light'}
					<style lang="scss">
					  @use '~highlight.js/styles/atom-one-light.css';
					</style>
				{:else}
					<style lang="scss">
					  @use '~highlight.js/styles/atom-one-dark.css';
					</style>
				{/if}
				<pre class="font-mono font-semibold text-md leading-tight">{@html highlightedCode}</pre>
			</div>
		{:else}
			<ul class="menu p-2 compact overflow-y-scroll">
				{#each files as file}
					<li>
						<button
								class="btn btn-ghost normal-case text-base text-left justify-start h-6 min-h-8 items-center no-animation py-0"
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
	{/if}
</div>
