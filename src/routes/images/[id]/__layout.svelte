<script lang="ts">
	import {page} from '$app/stores';

	import DiscIcon from '$lib/assets/icons/disc.svg';
	import CubeIcon from '$icons/cube.svg';
	import PlusIcon from '$icons/plus.svg';
	import {Image, images} from '$lib/stores/images';
	import {containers} from '$lib/stores/containers';

	let image:Image;

	$: image = $images.find(i => i.id.startsWith('sha256:'+$page.params.id));

	$: countContainers = $containers.filter(c => c.imageId === image.id).length;

</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>


<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl pb-4">
	<div class="text-3xl font-bold pb-4 mx-8 pt-6">
		<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/images">Images / </a>
		{image?.tags.join(',') ?? $page.params.id}
		<div class="badge badge-lg float-right mt-1 text-lg h-8 border-none"
			class:bg-success={countContainers > 0}>
			{countContainers > 0 ? 'used' : 'unused'}
		</div>
	</div>
</div>
<div class="mx-4 sticky top-[5.75rem] z-50">
	<ul class="menu items-stretch px-6 shadow-lg bg-base-100 horizontal rounded-box w-full mt-0 z-30">
		<li class:bordered={$page.path === `/images/${$page.params.id}`}>
			<a href="/images/{$page.params.id}/">
				<DiscIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				General
			</a>
		</li>
		<li class:bordered={$page.path === `/images/${$page.params.id}/containers`}>
			<a href="/images/{$page.params.id}/containers">
				<CubeIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				Containers
			</a>
		</li>
		<li class:bordered={$page.path === `/images/${$page.params.id}/create`}>
			<a href="/images/{$page.params.id}/create">
				<PlusIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				New Container
			</a>
		</li>
	</ul>
</div>

<div class="mx-4 mt-8 mb-8">
	<slot></slot>
</div>


