<script lang="ts">
	import DiscIcon from '$lib/client/assets/icons/disc.svg';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import CalendarIcon from '$icons/calendar.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import DownloadIcon from '$icons/download.svg';
	import StarIcon from '$icons/star.svg';
	import ImageTagsModal from '$lib/client/components/sources/ImageTagsModal.svelte';
	import ExternalLinkIcon from '$icons/external-link.svg';

	export let image;

	let open = false;

	let loading = false;
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-auto overflow-hidden">
	<div class="mx-1 sm:mx-2 w-24 {$$props.class}" class:text-success={false}>
		{#if image['logo_url']?.['large']}
			<img src={image['logo_url']?.['large']} alt=''
				 class="w-14 h-14 sm:h-20 sm:w-20 mx-auto mt-1 stroke-[1.5px] bg-white p-2 rounded-md"/>
		{:else}
			<DiscIcon class="w-10 h-10 sm:h-16 sm:w-16 mx-auto mt-3 sm:mt-1 stroke-[1.5px]"/>
		{/if}
	</div>
	<a class="block w-64 flex-auto overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	   href="https://hub.docker.com/{image['publisher']['id'] === 'docker' ? '_' : 'r'}/{image['slug']}" target="_blank">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{image['name']}
		</span>
		<p class="inline-block w-full overflow-hidden overflow-ellipsis mt-1 min-h-12 text-base">
			{image['short_description']}
		</p>
	</a>
	<div class="block w-32 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={CalendarIcon}>
			{new Date(image['updated_at']).toLocaleDateString()}
		</ItemInfo>
		<ItemInfo icon={StarIcon}>
			{image['star_count']}
		</ItemInfo>
		<ItemInfo icon={DownloadIcon} class="mb-0">
			{image['pull_count']}
		</ItemInfo>
	</div>
	<div class="block w-24 md:w-24 overflow-hidden flex-shrink-0 self-center">
		<ActionButton icon={DownloadIcon} loading={loading}
					  class="w-24 h-8 md:h-12 md:w-24 md:mr-2" on:click={() => open = true}>
			Pull
		</ActionButton>
		<ImageTagsModal bind:open={open} name={image['name']}/>
		<a href="https://hub.docker.com/{image['publisher']['id'] === 'docker' ? '_' : 'r'}/{image['slug']}" target="_blank"
		   class="btn btn-ghost w-24 justify-start h-8 btn-block min-h-0 text-base px-2 mt-2">
			<ExternalLinkIcon class="h-6 w-6 mr-2 stroke-2"/>
			<span class="mt-0">Info</span>
		</a>
	</div>
</div>
