<script lang="ts">
	import { enhance } from '$app/forms';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import DownloadIcon from '$icons/arrow-down-tray.svg';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import type Repo from '$lib/server/sources/git/Repo';

	export let data: {
		info: {
			repo: Repo;
			newCommits: Promise<{ hash: string }[]>;
		};
	};
	let loading = false;
</script>

<svelte:head>
	<title>Git Repo - Light-Whale</title>
</svelte:head>

{#await data.info.newCommits then newCommits}
	{#if newCommits.length === 0}
		<CheckCard
			status="success"
			title="Repo is up to date"
			msg="There are no new commits to pull."
		/>
	{:else}
		<CheckCard
			status="warning"
			title="New Commits"
			msg="There {newCommits.length === 1
				? 'is'
				: 'are'} {newCommits.length} new {newCommits.length === 1
				? 'commit'
				: 'commits'} in the repo."
		>
			<form
				method="POST"
				action="?/pull"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						loading = false;
						update();
					};
				}}
			>
				<ActionButton icon={DownloadIcon} {loading} class="w-auto px-3">Pull</ActionButton>
			</form>
		</CheckCard>
	{/if}
{/await}

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Repo</h2>
		<pre>
{JSON.stringify(data.info.repo, null, 2)}
		</pre>
	</div>
</div>

<style lang="scss">
</style>
