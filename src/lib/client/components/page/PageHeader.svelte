<script lang="ts">
	export let badge = '';
	export let badgeClass = '';
</script>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl pb-4">
	<div class="text-3xl font-bold pb-4 mx-8 pt-6">
		<slot></slot>
		{#if badge}
			<div class="badge badge-lg float-right mt-1 text-lg h-8 border-none {badgeClass}">
				{badge}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">

</style>
