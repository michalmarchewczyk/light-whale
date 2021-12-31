<script lang="ts">
	import {page} from '$app/stores';
	import {createEventDispatcher} from 'svelte';
	import {dockerAvailable} from '$lib/stores/docker';

	const dispatch = createEventDispatcher();

	export let currentTheme;
</script>

<ul class="menu p-4 px-4 overflow-y-auto bg-base-100 w-60 shadow-r-lg lg:shadow-none lg:border-r-2 lg:border-base-300 pb-2">
	<li>
		<a href="/" class:bg-base-300="{$page.path === '/'}" on:click={() => dispatch('navigate')}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
			</svg>
			<span class="mx-3">Home</span>
		</a>
	</li>
	<li>
		<a href="/stats" class:bg-base-300="{$page.path.startsWith('/stats')}" on:click={() => dispatch('navigate')}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
			</svg>
			<span class="mx-3">Statistics</span>
		</a>
	</li>
	<li class="menu-title mt-4 mb-2 flex-row">
		<span>
			Docker
		</span>
		<div class="badge mt-0.5 {$dockerAvailable ? 'badge-success' : 'badge-error'}">
			{$dockerAvailable ? 'Connected' : 'Disconnected'}
		</div>
	</li>
	<li>
		<a href="/containers" class:bg-base-300="{$page.path.startsWith('/containers')}"
		   on:click={() => dispatch('navigate')}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
			</svg>
			<span class="mx-3">Containers</span>
		</a>
	</li>
	<li>
		<a href="/images" class:bg-base-300="{$page.path.startsWith('/images')}" on:click={() => dispatch('navigate')}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
			</svg>
			<span class="mx-3">Images</span>
		</a>
	</li>
	<li>
		<a href="/volumes" class:bg-base-300="{$page.path.startsWith('/volumes')}"
		   on:click={() => dispatch('navigate')}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
			</svg>
			<span class="mx-3">Volumes</span>
		</a>
	</li>
	<li class="menu-title mt-4 mb-2">
	  <span>
		  Networking
	  </span>
	</li>
	<li>
		<a href="/sites" class:bg-base-300="{$page.path.startsWith('/sites')}" on:click={() => dispatch('navigate')}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
			</svg>
			<span class="mx-3">Sites</span>
		</a>
	</li>
	<li>
		<a href="/settings" class:bg-base-300="{$page.path.startsWith('/settings')}"
		   on:click={() => dispatch('navigate')}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
				 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
			</svg>
			<span class="mx-3">Settings</span>
		</a>
	</li>
	<li class="mt-auto">
		<button class="btn btn-sm mt-4 text-xs btn-ghost" on:click={() => {
			const newTheme = currentTheme === 'default-light' ? 'default-dark' : 'default-light';
			dispatch('changeTheme', newTheme);
		}}>
			Change to {currentTheme === 'default-light' ? 'dark' : 'light'} theme
		</button>
	</li>

</ul>


<style lang="scss">
  .menu li {
	@apply mb-2 text-base-content;
  }
</style>
