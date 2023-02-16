<script lang="ts">
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import PageMenu from '$lib/client/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/client/components/page/PageMenuItem.svelte';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import ClipboardCheckIcon from '$icons/clipboard-document-check.svg';
	import ExternalLinkIcon from '$icons/arrow-top-right-on-square.svg';
	import type SiteData from '$lib/server/sites/SiteData';
	import { page } from '$app/stores';
	import type ContainerData from '$lib/server/docker/ContainerData';

	export let data: { site: SiteData; siteContainer?: ContainerData };

	let online = !data.site.paused && data.siteContainer?.state === 'running';
</script>

<PageHeader
	badge={data.site?.paused ? 'Disabled' : online ? 'Online' : 'Offline'}
	badgeClass={online ? 'bg-success' : 'bg-error'}
>
	<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/sites"
		>Sites /
	</a>
	<a
		class="text-3xl hover:text-primary-focus"
		href="http://{data.site?.domain}"
		target="_blank"
		rel="noreferrer"
	>
		<span>{data.site?.domain}</span>
		<ExternalLinkIcon class="inline-block w-8 h-8 stroke-2 align-top mt-0.5" />
	</a>
</PageHeader>
<PageMenu>
	<PageMenuItem icon={GlobeAltIcon} path="/sites/{$page.params.domain}">General</PageMenuItem>
	<PageMenuItem icon={ClipboardCheckIcon} path="/sites/{$page.params.domain}/test"
		>Test</PageMenuItem
	>
</PageMenu>
<div class="mx-4 mt-8 mb-8">
	<slot />
</div>
