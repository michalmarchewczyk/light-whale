<script lang="ts">
	import { enhance } from '$app/forms';
	import CloudflareIcon from '$lib/client/assets/icons/cloudflare.svg';

	let token = '';
	let description = '';
	let loading = false;

	let selectedService = 'Cloudflare';
	let tokenInput: HTMLInputElement;
</script>

<svelte:head>
	<title>DNS Setup - Light-Whale</title>
</svelte:head>

<h2 class="text-2xl font-bold mb-8">Setup DNS Provider</h2>
<p>
	Connect Light-Whale to your DNS Provider to more easily manage your domains.
	<br />
	You can always do that later in settings.
</p>
<br />
<p>
	To connect your DNS provider account, you need to create a Personal Access Token with permission
	to read and edit DNS zones and records.
</p>
<br />
<form
	method="POST"
	use:enhance={() => {
		loading = true;
		return ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<span class="text-lg font-semibold mb-4 block">Add Token</span>
	<div class="flex space-x-4">
		<label class="w-32">
			<input type="hidden" name="service" value={selectedService.toLowerCase()} />
			<div class="dropdown flex-1 w-32">
				<button class="select select-bordered bg-base-100 align-middle w-full" type="button">
					<span class="mt-2 text-base">
						{#if selectedService === 'Cloudflare'}
							<CloudflareIcon class="w-20 h-8 ml-[-0.25rem]" />
						{/if}
					</span>
				</button>
				<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full">
					<li>
						<button
							on:click={() => {
								selectedService = 'Cloudflare';
								tokenInput.focus();
							}}
							type="button"
						>
							<CloudflareIcon class="w-24 h-8" /></button
						>
					</li>
				</ul>
			</div>
		</label>
		<label class="input-group flex-1">
			<span>Token: </span>
			<input
				bind:value={token}
				type="text"
				name="pat"
				placeholder="token"
				class="input input-bordered text-base w-full"
				bind:this={tokenInput}
			/>
		</label>
		<label class="input-group flex-1">
			<span>Description: </span>
			<input
				bind:value={description}
				type="text"
				name="description"
				placeholder="description"
				class="input input-bordered text-base w-full"
			/>
		</label>
	</div>
	<div class="flex-row-reverse card-actions justify-between self-end bottom-0 mt-8">
		<div>
			<button class="btn btn-primary text-base" disabled={!token || loading} class:loading
				>Next</button
			>
		</div>
		<a class="btn btn-primary text-base" href="/setup/github">Skip</a>
	</div>
</form>

<style lang="scss">
</style>
