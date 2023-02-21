<script lang="ts">
	import StatusOnlineIcon from '$icons/signal.svg';
	import StatusOfflineIcon from '$icons/signal-slash.svg';
	export let status = '';
</script>

<div
	class="mx-1 sm:mx-2 w-16 sm:w-20 flex-shrink-0"
	class:text-error={status !== 'online'}
	class:text-success={status === 'online'}
	class:text-warning={status === 'paused'}
>
	{#if status === 'online'}
		<StatusOnlineIcon class="w-8 h-8 sm:h-10 sm:w-10 mx-auto mt-0 stroke-[1.5px]" />
	{:else}
		<StatusOfflineIcon class="w-8 h-8 sm:h-10 sm:w-10 mx-auto mt-0 stroke-[1.5px]" />
	{/if}
	<span
		class="uppercase w-full text-center mt-1 block font-bold text-sm sm:text-base
		 overflow-hidden overflow-ellipsis sm:overflow-visible whitespace-nowrap"
	>
		{status === 'paused' ? 'Disabled' : status === 'online' ? 'Online' : 'Offline'}
	</span>
</div>
