<script lang="ts">
	import DiscIcon from '$lib/client/assets/icons/disc.svg';
	import CubeIcon from '$icons/cube.svg';
	import PlusIcon from '$icons/plus.svg';
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import PageMenu from '$lib/client/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/client/components/page/PageMenuItem.svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: countContainers = data?.imageContainers.length;
</script>

<PageHeader
	badge={countContainers > 0 ? 'used' : 'unused'}
	badgeClass={countContainers > 0 ? 'bg-success' : ''}
>
	<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/images"
		>Images /
	</a>
	{data.image?.tags.join(',') ?? $page.params.id}
</PageHeader>

<PageMenu>
	<PageMenuItem icon={DiscIcon} path="/images/{$page.params.id}">General</PageMenuItem>
	<PageMenuItem icon={CubeIcon} path="/images/{$page.params.id}/containers">
		Containers
		<div class="badge ml-2 mt-0.5">
			{countContainers}
		</div>
	</PageMenuItem>
	<PageMenuItem icon={PlusIcon} path="/images/{$page.params.id}/create">New Container</PageMenuItem>
</PageMenu>

<div class="mx-4 mt-8 mb-8">
	<slot />
</div>
