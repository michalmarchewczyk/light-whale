<script lang="ts">
	import type Component from 'svelte/types/compiler/compile/Component';

	export let data: { component: Component; title: string };
</script>

<svelte:head>
	<title>{data.title} - Light-Whale Docs</title>
</svelte:head>

<div class="prose">
	<svelte:component this={data.component} />
</div>

<style lang="scss">
</style>
