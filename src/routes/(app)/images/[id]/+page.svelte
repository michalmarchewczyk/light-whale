<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Image - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Information</h2>
		<p>
			Tags({data.image?.tags.length}):
			<span class="font-bold">{data.image?.tags.join(', ')}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{data.image?.id}</span>
		</p>
	</div>
</div>
