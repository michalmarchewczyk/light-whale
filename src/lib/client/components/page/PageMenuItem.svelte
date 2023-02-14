<script lang="ts">
	import { page } from '$app/stores';
	export let path = '';
	export let icon;
</script>

<li
	class:bordered={$page.url.pathname === `${path}` || $page.url.pathname === `${path}/`}
	class="rounded-none"
>
	<a href={path}>
		<svelte:component this={icon} class="w-6 h-6 stroke-2 inline-block mr-0 opacity-80 mb-[-2px]" />
		<slot />
	</a>
</li>

<style lang="scss">
	li {
		a {
			border-radius: 0 !important;
		}
	}
</style>
