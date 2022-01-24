<script lang="ts">
	import {page} from '$app/stores';
	import {paramsToLink} from '$lib/utils/paramsToLink';

	export let name = '';
	export let values:string[] = [];
	export let defaultValue = values[0] ?? '-';
	export let value;

	$: value = $page.url.searchParams.get(name) ?? defaultValue;
</script>

<div class="inline-block {$$props.class}">
	<span class="text-lg font-semibold align-middle capitalize">{name}:</span>
	<div class="dropdown">
		<button class="select select-bordered bg-base-100 align-middle ml-2 w-36 capitalize">
			{#if $page.url.searchParams.get(name)}
				<span class="mt-2 text-base">{value}</span>
			{:else}
				<span class="mt-2 text-base">{defaultValue}</span>
			{/if}
		</button>
		<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-36 ml-2">
			{#each values as val}
				<li>
					<a href="{paramsToLink($page.url.search, {[name]: val})}" class="capitalize">
						{val}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">

</style>
