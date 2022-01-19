<script lang="ts">
	export let icon = '';
	export let title = '';
	export let value = '';
</script>

<div class="stat">
	<div class="stat-figure text-primary">
		<svelte:component class="inline-block w-8 h-8 stroke-[1.5px]" this={icon}/>
	</div>
	<div class="stat-title">{title}</div>
	<div class="stat-value text-primary">{value}</div>
</div>
