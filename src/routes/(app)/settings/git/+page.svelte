<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import GitServiceTokenItem from '$lib/client/components/sources/GitServiceTokenItem.svelte';
	import GithubIcon from '$lib/client/assets/icons/github.svg';
	import GitlabIcon from '$lib/client/assets/icons/gitlab.svg';
	import BitbucketIcon from '$lib/client/assets/icons/bitbucket.svg';
	import JetBrainsSpaceIcon from '$lib/client/assets/icons/space.svg';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading = false;

	export let form: ActionData;

	let selectedService = 'GitHub';

	let tokenInput: HTMLInputElement;
</script>

<svelte:head>
	<title>Git Settings - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Git Service Tokens</h2>
		<table class="table w-full mt-2 mb-0">
			<tbody>
				{#each data.tokens as token}
					<GitServiceTokenItem {token} />
				{:else}
					<p class="w-full text-center text-3xl p-4 opacity-50">No tokens saved</p>
				{/each}
			</tbody>
		</table>
		<div class="divider mb-1 mt-0 mx-[-1.5rem]" />
		<form
			method="POST"
			action="?/add"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<span class="text-lg font-semibold mb-4 block">Add Token</span>
			<FormError error={form?.error} />
			<div class="flex space-x-4">
				<label class="w-32">
					<input type="hidden" name="service" value={selectedService.toLowerCase()} />
					<div class="dropdown flex-1 w-32">
						<button class="select select-bordered bg-base-100 align-middle w-full" type="button">
							<span class="mt-2 text-base">
								{#if selectedService === 'GitHub'}
									<GithubIcon class="w-16 h-8 ml-1" />
								{:else if selectedService === 'GitLab'}
									<GitlabIcon class="w-20 h-8 ml-[-0.25rem]" />
								{:else if selectedService === 'Bitbucket'}
									<BitbucketIcon class="w-20 h-8 ml-[-0.25rem]" />
								{:else if selectedService === 'JetBrainsSpace'}
									<JetBrainsSpaceIcon class="w-20 h-8 ml-[-0.25rem]" />
								{/if}
							</span>
						</button>
						<ul
							class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full"
						>
							<li>
								<button
									on:click={() => {
										selectedService = 'GitHub';
										tokenInput.focus();
									}}
									type="button"
								>
									<GithubIcon class="w-20 h-8 ml-2" /></button
								>
							</li>
							<li>
								<button
									on:click={() => {
										selectedService = 'GitLab';
										tokenInput.focus();
									}}
									type="button"
								>
									<GitlabIcon class="w-24 h-8" /></button
								>
							</li>
							<li>
								<button
									on:click={() => {
										selectedService = 'Bitbucket';
										tokenInput.focus();
									}}
									type="button"
								>
									<BitbucketIcon class="w-24 h-8" /></button
								>
							</li>
							<li>
								<button
									on:click={() => {
										selectedService = 'JetBrainsSpace';
										tokenInput.focus();
									}}
									type="button"
								>
									<JetBrainsSpaceIcon class="w-24 h-10 my-[-0.25rem]" /></button
								>
							</li>
						</ul>
					</div>
				</label>
				{#each data.tokenFields[selectedService.toLowerCase()] as field, index}
					<label class="input-group flex-1">
						<span class="capitalize whitespace-nowrap">{field}: </span>
						{#if index === 0}
							<input
								name={field}
								type="text"
								placeholder={field}
								class="input input-bordered text-base w-full"
								bind:this={tokenInput}
							/>
						{:else}
							<input
								name={field}
								type="text"
								placeholder={field}
								class="input input-bordered text-base w-full"
							/>
						{/if}
					</label>
				{/each}
			</div>
			<div class="flex space-x-4 mt-4 w-full justify-end">
				<label class="input-group flex-1">
					<span>Description: </span>
					<input
						name="description"
						type="text"
						placeholder="description"
						class="input input-bordered text-base w-full"
					/>
				</label>
				<label class="pl-0 flex flex-0 space-x-4">
					<span class="text-lg mb-0 mt-2 whitespace-nowrap ml-4">Confirm Password: </span>
					<input
						name="password"
						class="input input-bordered w-full text-base"
						placeholder="password"
						type="password"
					/>
				</label>
				<button class="flex-none btn btn-primary cursor-pointer" disabled={loading} class:loading>
					Add
				</button>
			</div>
		</form>
		<!--		<GithubTokenAddForm on:refresh={() => (get = getTokensInfo)} />-->
	</div>
</div>

<style lang="scss">
</style>
