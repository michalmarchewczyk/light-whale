<script lang="ts">
	export let title = '';
	export let badge = '';
</script>

<div class="text-3xl font-bold pb-2 border-b-2 border-base-300 mx-8 pt-5">
	{title}
	{#if badge}
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{badge}
		</div>
	{/if}
	<div class="w-full mt-6 empty:mt-2 text-base font-normal">
		<slot />
	</div>
</div>
