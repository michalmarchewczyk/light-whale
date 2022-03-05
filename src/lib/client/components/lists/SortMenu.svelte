<script lang="ts">
	import {page} from '$app/stores';
	import {paramsToLink} from '$lib/client/utils/paramsToLink';

	export let values:string[] = [];
	export let defaultValue = values[0] ?? '-';
	export let value;
	export let order;

	$: value = $page.url.searchParams.get('sort') ?? defaultValue;
	$: order = $page.url.searchParams.get('order') ?? 'desc';
</script>

<div class="inline-block {$$props.class}">
	<span class="text-lg font-semibold align-middle capitalize">Sort:</span>
	<div class="dropdown">
		<button class="select select-bordered bg-base-100 align-middle ml-2 w-44 capitalize">
			{#if $page.url.searchParams.get('sort')}
				<span class="mt-2 text-base">{value} ({order})</span>
			{:else}
				<span class="mt-2 text-base">{defaultValue} ({order})</span>
			{/if}
		</button>
		<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-44 ml-2">
			{#each values as val}
				<li>
					<a href="{paramsToLink($page.url.search, {sort: val, order: 'asc'})}" class="capitalize">
						{val} (Asc)
					</a>
				</li>
				<li>
					<a href="{paramsToLink($page.url.search, {sort: val, order: 'desc'})}" class="capitalize">
						{val} (Desc)
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">

</style>
