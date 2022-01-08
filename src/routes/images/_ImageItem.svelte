<script lang="ts">
	import {containers} from '$lib/stores/containers';

	import CalendarIcon from '$icons/calendar.svg';
	import DiscIcon from '$lib/assets/icons/disc.svg';
	import TrashIcon from '$icons/trash.svg';
	import PlusIcon from '$icons/plus.svg';
	import PuzzleIcon from '$icons/puzzle.svg';
	import type {Image} from '$lib/stores/images';
	import {bytesToHuman} from '$lib/utils/bytesToHuman';

	export let image:Image;

	$: countContainers = $containers.filter(c => c.imageId === image.id).length;
	$: shortId = image?.id.substring(7, 19) ?? '';
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-[5.5rem] overflow-hidden">
	<div class="mx-1 sm:mx-2 w-16 sm:w-20 flex-shrink-0"
		 class:text-success={countContainers > 0}
	>
		<DiscIcon class="w-8 h-8 sm:h-10 sm:w-10 mx-auto mt-0 stroke-[1.5px]"/>
		<span class="uppercase w-full text-center mt-1 block font-bold text-sm sm:text-base
		 overflow-hidden overflow-ellipsis sm:overflow-visible whitespace-nowrap">
			{countContainers > 0 ? 'used' : 'unused'}
		</span>
	</div>
	<a class="block w-60 flex-auto w-60 overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	   href="/images/{image.id}">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{image.tags.join(', ')}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1.5">ID: {image.id}</span>
	</a>
	<div class="block w-40 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<div class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left" data-tip="Created">
			<CalendarIcon class="h-6 w-6 inline-block float-left mt-0.5 stroke-2"/>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{new Date(image.created).toLocaleDateString()}
			</span>
		</div>
		<div class="block h-7 w-full float-left mb-0.5 tooltip tooltip-left" data-tip="Image">
			<PuzzleIcon class="h-6 w-6 inline-block float-left mt-0.5 stroke-2"/>
			<span class="inline-block w-[calc(100%-2rem)] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-left">
				{bytesToHuman(image.size)}
			</span>
		</div>
	</div>
	<div class="block w-28 md:w-60 overflow-hidden flex-shrink-0 self-center">
		<button class="btn btn-primary w-28 justify-start h-8 md:h-12 btn-block min-h-0 text-base px-2"
				>
			<PlusIcon class="h-6 w-6 mr-2 stroke-2"/>
			<span class="mt-[-0.25rem]">Create</span>
		</button>
		<button class="btn btn-primary w-28 justify-start h-8 md:h-12 btn-block min-h-0 text-base px-2 md:ml-2 mt-1 md:mt-0"
		>
			<TrashIcon class="h-6 w-6 mr-2 stroke-2"/>
			<span class="mt-[-0.25rem]">Delete</span>
		</button>
	</div>
</div>

<style lang="scss">

</style>
