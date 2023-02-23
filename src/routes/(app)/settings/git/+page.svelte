<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
	import GitServiceTokenItem from '$lib/client/components/sources/GitServiceTokenItem.svelte';

	export let data: { tokens: GitServiceToken[] };

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
		<table class="table w-full mt-4 mb-0">
			<tbody>
				{#each data.tokens as token}
					<GitServiceTokenItem {token} />
				{:else}
					<p class="w-full text-center text-3xl p-4 opacity-50">No tokens saved</p>
				{/each}
			</tbody>
		</table>
		<div class="divider mb-0 mt-0" />
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
							<span class="mt-2 text-base">{selectedService}</span>
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
									type="button">GitHub</button
								>
							</li>
							<li>
								<button
									on:click={() => {
										selectedService = 'GitLab';
										tokenInput.focus();
									}}
									type="button">GitLab</button
								>
							</li>
						</ul>
					</div>
				</label>
				<label class="input-group flex-1">
					<span>Token: </span>
					<input
						name="token"
						type="text"
						placeholder="token"
						class="input input-bordered text-base w-full"
						bind:this={tokenInput}
					/>
				</label>
				<label class="input-group flex-1">
					<span>Description: </span>
					<input
						name="description"
						type="text"
						placeholder="description"
						class="input input-bordered text-base w-full"
					/>
				</label>
			</div>
			<div class="flex space-x-4 mt-4 w-full justify-end">
				<label class="pl-0 flex flex-0 space-x-4">
					<span class="text-lg mb-0 mt-2 whitespace-nowrap">Confirm Password: </span>
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
