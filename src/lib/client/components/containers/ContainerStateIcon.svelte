<script lang="ts">
	import CubeIcon from '$icons/cube.svg';
	import CubeTransparentIcon from '$icons/cube-transparent.svg';
	import RefreshIcon from '$icons/arrow-path.svg';
	import PauseIcon from '$icons/pause-circle.svg';
	export let state = '';
</script>

<div
	class="mx-2 sm:mx-3 w-16 sm:w-24 {$$props.class}"
	class:text-error={state === 'dead' || state === 'removing'}
	class:text-info={state === 'created'}
	class:text-success={state === 'running'}
	class:text-warning={state === 'paused' || state === 'restarting'}
>
	{#if state === 'created'}
		<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]" />
	{:else if state === 'running'}
		<CubeIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]" />
	{:else if state === 'restarting'}
		<RefreshIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]" />
	{:else if state === 'paused'}
		<PauseIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]" />
	{:else if state === 'exited'}
		<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]" />
	{:else if state === 'removing'}
		<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]" />
	{:else if state === 'dead'}
		<CubeTransparentIcon class="w-10 h-10 sm:h-12 sm:w-12 mx-auto mt-2 sm:mt-1 stroke-[1.5px]" />
	{/if}
	<span
		class="uppercase w-full text-center mt-1.5 block font-bold text-sm sm:text-base overflow-hidden overflow-ellipsis sm:overflow-visible"
	>
		{state}
	</span>
</div>
