<script lang="ts">
	import type SiteData from '$lib/server/sites/SiteData';
	import type ContainerData from '$lib/server/docker/ContainerData';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import { enhance } from '$app/forms';
	import PlusIcon from '$icons/plus.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import Placeholder from '$lib/client/components/Placeholder.svelte';

	export let data: {
		site: SiteData;
		siteContainer?: ContainerData;
		dns: { added: Promise<string[]>; missing: Promise<string[]> };
	};

	let loading = false;
</script>

<svelte:head>
	<title>Site - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Information</h2>
		<p>
			Domain:
			<span class="font-bold">{data.site?.domain}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{data.site?.id}</span>
		</p>
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-6">
	<a
		class="card-body p-6 pt-5 hover:text-primary-focus"
		href="/containers/{data.siteContainer?.name.substring(1) ?? ''}"
	>
		<h2 class="card-title text-xl">Site container</h2>
		{#if !data.siteContainer}
			<p>No container found</p>
		{:else}
			<p>
				ID:
				<span class="font-bold">{data.siteContainer?.id}</span>
			</p>
			<p>
				Name:
				<span class="font-bold">{data.siteContainer?.name}</span>
			</p>
			<p>
				Port:
				<span class="font-bold">{data.site.containerPort}</span>
			</p>
		{/if}
	</a>
</div>

{#await Promise.all([data.dns.added, data.dns.missing])}
	<Placeholder />
{:then [added, missing]}
	<CheckCard
		title="DNS"
		status={missing.length === 0 ? 'success' : added.length === 0 ? 'error' : 'warning'}
		msg={missing.length === 0
			? `All saved IP addresses are added to DNS records (added: ${added.join(', ')})`
			: added.length === 0
			? `No saved IP addresses are added to DNS records (missing: ${missing.join(', ')}})`
			: `Only some saved IP addresses are added to DNS records
			 (added: ${added.join(', ')}, missing: ${missing.join(', ')})`}
	/>
	{#if missing.length !== 0}
		<form
			class="card shadow-md bg-base-100 mb-6"
			action="?/fix"
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div class="card-body p-6 py-4 pl-5 flex flex-row justify-between items-center">
				<div>
					<h2 class="card-title text-xl mb-1">Add missing records</h2>
					<p>Create DNS records for all missing saved IP addresses</p>
				</div>
				<ActionButton class="w-24" icon={PlusIcon} {loading}>Add</ActionButton>
			</div>
		</form>
	{/if}
{/await}
