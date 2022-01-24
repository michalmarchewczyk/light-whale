<script lang="ts">
	export let title = '';
	export let badge = '';
</script>

<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
	{title}
	{#if badge}
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{badge}
		</div>
	{/if}
	<div class="w-full mt-6 text-base font-normal">
		<slot></slot>
	</div>
</div>

<style lang="scss">

</style>
