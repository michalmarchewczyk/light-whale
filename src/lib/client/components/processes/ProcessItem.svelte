<script lang="ts">
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import ActionButton from '$lib/client/components/ActionButton.svelte';

	import ClockIcon from '$icons/clock.svg';
	import BoltIcon from '$icons/bolt.svg';
	import ArrowTopRightOnSquareIcon from '$icons/arrow-top-right-on-square.svg';
	import ArrowPathIcon from '$icons/arrow-path.svg';
	import CheckIcon from '$icons/check.svg';

	import type Process from '$lib/server/processes/Process';
	import ProcessModal from '$lib/client/components/processes/ProcessModal.svelte';

	export let process: Process;

	let open = false;
</script>

<div
	class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-[5.5rem] overflow-hidden h-auto"
>
	<div
		class="block w-48 flex-auto overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus cursor-pointer"
		on:click={() => (open = true)}
	>
		<span
			class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl pl-5"
		>
			{process.title}
		</span>
		<ItemInfo
			class="mt-1.5 pl-5"
			icon={process.state === 'done' || process.state === 'error' ? CheckIcon : ArrowPathIcon}
		>
			{process.state}
		</ItemInfo>
	</div>
	<div class="block w-36 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={ClockIcon}>
			Started: {process.started.toLocaleString()}
		</ItemInfo>
		<ItemInfo icon={BoltIcon}>
			{#if process.state === 'done' || process.state === 'error'}
				Finished: {process.lastUpdated.toLocaleString()}
			{:else if process.progress === -1 || isNaN(process.progress)}
				<progress class="progress progress-primary" />
			{:else}
				<progress class="progress progress-primary" value={process.progress} max="100" />
			{/if}
		</ItemInfo>
	</div>
	<div class="block w-24 md:w-24 overflow-hidden flex-shrink-0 self-center">
		<ActionButton
			icon={ArrowTopRightOnSquareIcon}
			class="w-24 h-8 md:h-12 md:w-24 md:mr-2 btn-ghost"
			on:click={() => (open = true)}>View</ActionButton
		>
		{#if open}
			<ProcessModal bind:open {process} />
		{/if}
	</div>
</div>
