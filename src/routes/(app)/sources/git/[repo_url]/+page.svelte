<script lang="ts">
	import { enhance } from '$app/forms';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import DownloadIcon from '$icons/arrow-down-tray.svg';
	import SquaresPlusIcon from '$icons/squares-plus.svg';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import RepoBuildModal from '$lib/client/components/sources/RepoBuildModal.svelte';
	import Placeholder from '$lib/client/components/Placeholder.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: isComposeFile = data.info.repo?.dockerInfo.topFile?.includes('compose');

	let loading = false;

	let open = false;
</script>

<svelte:head>
	<title>Git Repo - Light-Whale</title>
</svelte:head>

{#await data.info.newCommits}
	<Placeholder />
{:then newCommits}
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
		<h2 class="card-title text-xl">Build repo</h2>
		{#if data.info.repo.dockerInfo.topFile.length === 0}
			<p>No Dockerfile or docker-compose.yml found in the repo.</p>
		{:else}
			<p>
				Found files:
				{data.info.repo.dockerInfo.files.map((f) => f.file).join(', ')}
				<br />
				Click the button below to build image from Dockerfile or create the app from docker-compose files.
			</p>
		{/if}
		<div class="card-actions mt-2">
			<ActionButton
				icon={SquaresPlusIcon}
				{loading}
				disabled={data.info.repo.dockerInfo.topFile.length === 0}
				on:click={() => (open = true)}
				class="w-auto px-3"
			>
				{isComposeFile ? 'Create' : 'Build'}
			</ActionButton>
			<RepoBuildModal bind:open repo={data.info.repo} />
		</div>
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl mb-2">Repository information</h2>
		<p>
			Remote URL:
			<span class="font-bold">{data.info.repo.gitInfo.remoteUrl}</span>
		</p>
		<p>
			Default branch name:
			<span class="font-bold">{data.info.repo.gitInfo.branchName}</span>
		</p>
		<p>
			Repository's owner:
			<span class="font-bold">{data.info.repo.gitInfo.owner}</span>
		</p>
		<p>
			Detected languages:
			<span class="font-bold">{data.info.repo.languageInfo.languages.join(', ')}</span>
		</p>
	</div>
</div>
