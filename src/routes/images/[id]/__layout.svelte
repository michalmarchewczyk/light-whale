<script lang="ts">
	import {page} from '$app/stores';

	import DiscIcon from '$lib/assets/icons/disc.svg';
	import CubeIcon from '$icons/cube.svg';
	import PlusIcon from '$icons/plus.svg';
	import {Image, images} from '$lib/stores/images';
	import {containers} from '$lib/stores/containers';
	import PageHeader from '$lib/components/page/PageHeader.svelte';
	import PageMenu from '$lib/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/components/page/PageMenuItem.svelte';

	let image:Image;

	$: image = $images.find(i => i.id.startsWith('sha256:' + $page.params.id));

	let countContainers:number;
	$: countContainers = $containers.filter(c => c.imageId === image.id).length;

</script>

<svelte:head>
	<title>Images</title>
</svelte:head>


<PageHeader badge="{countContainers > 0 ? 'used' : 'unused'}" badgeClass={countContainers > 0 ? 'bg-success' : ''}>
	<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/images">Images / </a>
	{image?.tags.join(',') ?? $page.params.id}
</PageHeader>

<PageMenu>
	<PageMenuItem icon={DiscIcon} path="/images/{$page.params.id}">
		General
	</PageMenuItem>
	<PageMenuItem icon={CubeIcon} path="/images/{$page.params.id}/containers">
		Containers
		<div class="badge ml-2 mt-0.5">
			{countContainers}
		</div>
	</PageMenuItem>
	<PageMenuItem icon={PlusIcon} path="/images/{$page.params.id}/create">
		New Container
	</PageMenuItem>
</PageMenu>

<div class="mx-4 mt-8 mb-8">
	<slot></slot>
</div>


