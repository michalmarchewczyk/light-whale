<script lang="ts">
	import ExclamationCircleIcon from '$icons/exclamation-circle.svg';
	export let error = '';
</script>

{#if error}
	<div class="alert alert-error my-2 {$$props.class}">
		<div class="flex-1 font-semibold">
			<ExclamationCircleIcon class="h-6 w-6 stroke-2 mr-4 ml-1" />
			<span>{error}</span>
		</div>
	</div>
{/if}

<style lang="scss">
</style>
