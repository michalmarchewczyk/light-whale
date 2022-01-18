<script lang="ts">
	import {page} from '$app/stores';
	import type {Site} from '$lib/stores/sites';
	import {sites} from '$lib/stores/sites';

	let site:Site;

	$: site = $sites.find(s => s.domain === $page.params.id);

</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Information</h2>
		<p>
			Domain:
			<span class="font-bold">{site?.domain}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{site?.id}</span>
		</p>
	</div>
</div>

<style lang="scss">

</style>
