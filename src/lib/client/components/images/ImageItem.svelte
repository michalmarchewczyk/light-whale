<script lang="ts">
	import CalendarIcon from '$icons/calendar.svg';
	import TrashIcon from '$icons/trash.svg';
	import PlusIcon from '$icons/plus.svg';
	import PuzzleIcon from '$icons/puzzle-piece.svg';
	import ImageUsedIcon from '$lib/client/components/images/ImageUsedIcon.svelte';
	import type ImageData from '$lib/server/docker/ImageData';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import { bytesToHuman } from '$lib/client/utils/bytesToHuman.js';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import { enhance } from '$app/forms';

	export let image: ImageData;

	export let used = false;

	let loading = false;

	$: shortId = image?.id.substring(7, 19) ?? '';

	let removeModal = false;
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-[5.5rem] overflow-hidden">
	<ImageUsedIcon {used} class="flex-shrink-0" />
	<a
		class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
		href="/images/{shortId}"
	>
		<span
			class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl"
		>
			{image.tags.join(', ')}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5"
			>ID: {image.id}</span
		>
	</a>
	<div class="block w-40 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={CalendarIcon}>
			{new Date(image.created).toLocaleDateString()}
		</ItemInfo>
		<ItemInfo icon={PuzzleIcon}>
			{bytesToHuman(image.size)}
		</ItemInfo>
	</div>
	<form
		class="block w-28 md:w-56 overflow-visible flex-shrink-0 self-center"
		method="POST"
		use:enhance={() => {
			loading = true;
			return ({ update }) => {
				loading = false;
				update();
			};
		}}
	>
		<ActionButton
			icon={PlusIcon}
			{loading}
			href="/images/{shortId}/create"
			class="w-28 h-8 md:h-12 md:w-24 md:mr-2"
		>
			New
		</ActionButton>
		<ActionButton
			icon={TrashIcon}
			{loading}
			disabled={used}
			on:click={() => (removeModal = true)}
			class="w-28 h-8 md:h-12 mt-1 md:mt-0"
			type="button"
		>
			Delete
		</ActionButton>
		<RemoveModal
			label="image"
			name={shortId}
			bind:open={removeModal}
			formaction="/images/{image.id}?/remove"
			bind:loading
		/>
	</form>
</div>
