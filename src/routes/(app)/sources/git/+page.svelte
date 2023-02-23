<script lang="ts">
	import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import RepoRemoteItem from '$lib/client/components/sources/RepoRemoteItem.svelte';
	import type Repo from '$lib/server/sources/git/Repo';
	import RepoSourceItem from '$lib/client/components/sources/RepoSourceItem.svelte';
	import RepoPullForm from '$lib/client/components/sources/RepoPullForm.svelte';

	export let data: {
		repos: { remoteRepos: Promise<GitServiceRepo[]>; localRepos: Promise<Repo[]> };
	};
</script>

<svelte:head>
	<title>Git Sources - Light-Whale</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	{#await Promise.all([data.repos.localRepos, data.repos.remoteRepos])}
		<ListHeader title="Sources / Git" badge="Loading..." />
	{:then repos}
		<ListHeader
			title="Sources / Git"
			badge="{repos[0].length} downloaded repos / {repos[1].length} remote repos"
		/>
	{/await}

	<div class="p-8 pt-2">
		<RepoPullForm />
		{#await data.repos.localRepos}
			<p class="w-full text-center text-3xl p-4 opacity-50">Loading...</p>
		{:then repos}
			{#each repos as repo}
				<RepoSourceItem {repo} />
			{:else}
				<p class="w-full text-center text-3xl p-4 opacity-50">No repositories pulled</p>
			{/each}
		{/await}
		<div class="divider" />
		{#await data.repos.remoteRepos}
			<p class="w-full text-center text-3xl p-4 opacity-50">Loading...</p>
		{:then repos}
			{#each repos as repo}
				<RepoRemoteItem {repo} />
			{:else}
				<p class="w-full text-center text-3xl p-4 opacity-50">
					Could not find any remote repositories
				</p>
			{/each}
		{/await}
	</div>
</div>

<style lang="scss">
</style>
