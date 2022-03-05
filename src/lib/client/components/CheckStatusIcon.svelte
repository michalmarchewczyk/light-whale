<script lang="ts">
	import CheckCircleIcon from '$icons/check-circle.svg';
	import ExclamationCircleIcon from '$icons/exclamation-circle.svg';
	import XCircleIcon from '$icons/x-circle.svg';

	export let status = '';
</script>

<div class="mx-1 sm:mx-2 w-16 sm:w-20 flex-shrink-0"
	 class:text-error={status === 'error'}
	 class:text-success={status === 'success'}
	 class:text-warning={status === 'warning'}
>
	{#if status === 'success'}
		<CheckCircleIcon class="w-12 h-12 sm:h-16 sm:w-16 mx-auto stroke-[1.5px]"/>
	{:else if status === 'warning'}
		<ExclamationCircleIcon class="w-12 h-12 sm:h-16 sm:w-16 mx-auto stroke-[1.5px]"/>
	{:else if status === 'error'}
		<XCircleIcon class="w-12 h-12 sm:h-16 sm:w-16 mx-auto stroke-[1.5px]"/>
	{/if}
</div>


<style lang="scss">

</style>
