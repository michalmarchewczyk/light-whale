<script lang="ts">
	import { theme, animations, hideLwContainer } from '$lib/client/stores/settings';
	import SiteItem from '$lib/client/components/sites/SiteItem.svelte';
	import { enhance } from '$app/forms';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import type { ActionData } from './$types';
	import PlusIcon from '$icons/plus.svg';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading = false;

	let selectedZone = 'Custom';

	data.info.zones.then((zones) => {
		selectedZone = zones[0]?.name ?? 'Custom';
	});

	let domainInput: HTMLInputElement;

	export let form: ActionData;
</script>

<svelte:head>
	<title>General Settings - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<span class="card-title mb-4">Appearance</span>
		<label class="flex align-middle items-center justify-between mb-4">
			<span class="text-lg w-40">Dark mode</span>
			<input
				type="checkbox"
				class="toggle mt-1"
				checked={$theme === 'default-dark'}
				on:change={() => {
					$theme = $theme === 'default-dark' ? 'default-light' : 'default-dark';
				}}
			/>
		</label>
		<label class="flex align-middle items-center justify-between">
			<span class="text-lg w-40 whitespace-nowrap">Disable animations</span>
			<input
				type="checkbox"
				class="toggle mt-1"
				checked={!$animations}
				on:change={() => {
					$animations = !$animations;
				}}
			/>
		</label>
	</div>
</div>
<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<label class="flex align-middle items-center justify-between">
			<span class="text-lg w-40  whitespace-nowrap">Hide LW Container</span>
			<input
				type="checkbox"
				class="toggle mt-1"
				checked={$hideLwContainer}
				on:change={() => {
					$hideLwContainer = !$hideLwContainer;
				}}
			/>
		</label>
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-4">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Publish Light-Whale Dashboard to site</h2>
		<form
			method="POST"
			action="?/publish"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<FormError error={form?.error} />
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 ">Domain: </span>
						<label class="input-group">
							<input
								class="input input-bordered w-full text-base"
								placeholder={selectedZone === 'Custom' ? 'example.com' : 'subdomain'}
								type="text"
								name="domain"
								bind:this={domainInput}
							/>
							<input type="hidden" name="zone" bind:value={selectedZone} />
							<div class="dropdown w-64">
								<button
									class="select select-bordered bg-base-100 align-middle w-full rounded-l-none"
									type="button"
								>
									{#if selectedZone === 'Custom'}
										<span class="text-base bg-base-100 px-0 mt-2.5 mb-2.5 italic">Custom</span>
									{:else}
										<span class="text-base bg-base-100 px-0 mt-2.5 mb-2.5 ">.{selectedZone}</span>
									{/if}
								</button>
								<ul
									class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full"
								>
									{#await data.info.zones then zones}
										{#each zones as zone}
											<li>
												<button
													type="button"
													on:click={() => {
														selectedZone = zone.name;
														domainInput.focus();
													}}
												>
													.{zone.name}
												</button>
											</li>
										{/each}
									{/await}
									<li>
										<button
											type="button"
											class="italic"
											on:click={() => {
												selectedZone = 'Custom';
												domainInput.focus();
											}}
										>
											Custom
										</button>
									</li>
								</ul>
							</div>
						</label>
					</label>
					<ActionButton {loading} disabled={loading} class="w-28" icon={PlusIcon}>
						Create
					</ActionButton>
				</div>
			</div>
		</form>
	</div>
</div>

<div>
	<div class="text-2xl font-bold pb-0 mx-6 pt-0 opacity-80">Dashboard sites</div>
	{#each data.adminSites as site}
		<SiteItem {site} />
	{:else}
		<p class="w-full text-center text-2xl pt-8 opacity-80">
			Light-Whale dashboard is not published on any site.
		</p>
	{/each}
</div>
