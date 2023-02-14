<script lang="ts">
	import DiscIcon from '$lib/client/assets/icons/disc.svg';
	export let used = false;
</script>

<div class="mx-1 sm:mx-2 w-16 sm:w-20 {$$props.class}" class:text-success={used}>
	<DiscIcon class="w-8 h-8 sm:h-10 sm:w-10 mx-auto mt-0 stroke-[1.5px]" />
	<span
		class="uppercase w-full text-center mt-1 block font-bold text-sm sm:text-base
		 overflow-hidden overflow-ellipsis sm:overflow-visible whitespace-nowrap"
	>
		{used ? 'used' : 'unused'}
	</span>
</div>
