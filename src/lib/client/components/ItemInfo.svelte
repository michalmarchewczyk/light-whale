<script lang="ts">
	export let icon;
</script>

<div class="block h-7 w-full float-left mb-0.5 {$$props.class}">
	<svelte:component this={icon} class="h-6 w-6 inline-block float-left mt-0.5 stroke-2"/>
	<span class="inline-block w-[calc(100%-2rem)] mt-[0.05rem] float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-2 text-left">
		<slot></slot>
	</span>
</div>

<style lang="scss">

</style>
