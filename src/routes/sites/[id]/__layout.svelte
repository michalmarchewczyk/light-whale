<script lang="ts">
	import {Site, sites} from '$lib/stores/sites';
	import {page} from '$app/stores';

	import GlobeAltIcon from '$icons/globe-alt.svg';
	import ClipboardCheckIcon from '$icons/clipboard-check.svg';
	import ExternalLinkIcon from '$icons/external-link.svg';
	import {Container, containers} from '$lib/stores/containers';
	import PageHeader from '$lib/components/page/PageHeader.svelte';
	import PageMenu from '$lib/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/components/page/PageMenuItem.svelte';

	let site:Site;

	$: site = $sites.find(s => s.domain === $page.params.id);

	let container:Container;

	$: container = $containers?.find(c => c.id.startsWith(site?.containerId));

	let online:boolean;

	$: online = site?.paused === false && container?.state === 'running';
</script>

<svelte:head>
	<title>Sites</title>
</svelte:head>

<PageHeader badge="{site?.paused ? 'Disabled' : online ? 'Online' : 'Offline'}"
			badgeClass="{online ? 'bg-success' : 'bg-error'}">
	<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/sites">Sites / </a>
	<a class="text-3xl hover:text-primary-focus" href="http://{site?.domain}" target="_blank">
		<span>{site?.domain}</span>
		<ExternalLinkIcon class="inline-block w-8 h-8 stroke-2 align-top mt-0.5"/>
	</a>
</PageHeader>

<PageMenu>
	<PageMenuItem icon={GlobeAltIcon} path="/sites/{$page.params.id}">
		General
	</PageMenuItem>
	<PageMenuItem icon={ClipboardCheckIcon} path="/sites/{$page.params.id}/test">
		Test
	</PageMenuItem>
</PageMenu>


<div class="mx-4 mt-8 mb-8">
	<slot></slot>
</div>

<style lang="scss">

</style>
