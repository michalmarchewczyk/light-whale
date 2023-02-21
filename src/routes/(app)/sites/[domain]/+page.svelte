<script lang="ts">
	import type SiteData from '$lib/server/sites/SiteData';
	import type ContainerData from '$lib/server/docker/ContainerData';

	export let data: { site: SiteData; siteContainer?: ContainerData };
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
		{/if}
	</a>
</div>
