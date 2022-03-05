<script lang="ts">
import {page} from '$app/stores';

export let path = '';
export let icon;
</script>

<li class:bordered={$page.url.pathname === `${path}`} class="rounded-none">
	<a href="{path}/">
		<svelte:component this={icon} class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
		<slot></slot>
	</a>
</li>

<style lang="scss">

</style>
