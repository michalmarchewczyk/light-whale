<script lang="ts">
	import Placeholder from '$lib/client/components/Placeholder.svelte';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Site Test - Light-Whale</title>
</svelte:head>

<CheckCard
	title="Container"
	status={data.siteContainer?.state === 'running' ? 'success' : 'error'}
	msg={!data.siteContainer
		? 'Site is not connected to any container'
		: data.siteContainer?.state === 'running'
		? `Container ${data.siteContainer?.name.slice(1)} is running`
		: `Container ${data.siteContainer?.name.slice(1)} is not running`}
/>

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
{/await}
