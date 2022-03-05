<script lang="ts">
	import {containers} from '$lib/client/stores/containers';

	import CalendarIcon from '$icons/calendar.svg';

	import TrashIcon from '$icons/trash.svg';
	import PlusIcon from '$icons/plus.svg';
	import PuzzleIcon from '$icons/puzzle.svg';
	import type {Image} from '$lib/client/stores/images';
	import {removeImage} from '$lib/client/stores/images';
	import {bytesToHuman} from '$lib/client/utils/bytesToHuman';
	import {goto} from '$app/navigation';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import ImageUsedIcon from '$lib/client/components/images/ImageUsedIcon.svelte';

	export let image:Image;

	let countContainers:number;
	let shortId:string;

	$: countContainers = $containers.filter(c => c.imageId === image.id).length;
	$: shortId = image?.id.substring(7, 19) ?? '';

	let removeModal = false;

	let loading = false;

	const create = async () => {
		loading = true;
		await goto(`/images/${image?.id.substring(7, 19)}/create`);
		loading = false;
	};

	const remove = async () => {
		loading = true;
		await removeImage(image?.id);
		loading = false;
	};
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-[5.5rem] overflow-hidden">
	<ImageUsedIcon used={countContainers > 0} class="flex-shrink-0"/>
	<a class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	   href="/images/{shortId}">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{image.tags.join(', ')}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5">ID: {image.id}</span>
	</a>
	<div class="block w-40 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={CalendarIcon}>
			{new Date(image.created).toLocaleDateString()}
		</ItemInfo>
		<ItemInfo icon={PuzzleIcon}>
			{bytesToHuman(image.size)}
		</ItemInfo>
	</div>
	<div class="block w-28 md:w-56 overflow-hidden flex-shrink-0 self-center">
		<ActionButton icon={PlusIcon} loading={loading} on:click={create} class="w-28 h-8 md:h-12 md:w-24 md:mr-2">
			New
		</ActionButton>
		<ActionButton icon={TrashIcon} loading={loading} disabled={countContainers > 0} on:click={() => removeModal = true}
					  class="w-28 h-8 md:h-12 mt-1 md:mt-0">
			Delete
		</ActionButton>
		<RemoveModal label="image" name="{shortId}" remove={remove} bind:open={removeModal}/>
	</div>
</div>
