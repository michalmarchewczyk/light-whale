<script lang="ts">
	import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import RepoRemoteItem from '$lib/client/components/sources/RepoRemoteItem.svelte';

	export let data: { remoteRepos: GitServiceRepo[] };

	let items: string[] = [];
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<ListHeader
		title="Sources / Git"
		badge="{items.length} downloaded repos / {data.remoteRepos.length} remote repos"
	/>
	<div class="p-8 pt-2">
		<!--    <RepoPullForm fetchItems={() => fetchItems()}/>-->
		{#each items as item}
			<!--      <RepoSourceItem repo={item}/>-->
			<div>{item}</div>
		{:else}
			<p class="w-full text-center text-3xl p-4 opacity-50">No repositories pulled</p>
		{/each}
		<div class="divider" />
		{#each data.remoteRepos as repo}
			<RepoRemoteItem {repo} />
		{:else}
			<p class="w-full text-center text-3xl p-4 opacity-50">
				Could not find any remote repositories
			</p>
		{/each}
	</div>
</div>

<style lang="scss">
</style>
