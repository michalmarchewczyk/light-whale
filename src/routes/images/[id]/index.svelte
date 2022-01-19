<script lang="ts">
	import {page} from '$app/stores';
	import type {Image} from '$lib/stores/images';
	import {images} from '$lib/stores/images';

	let image:Image;

	$: image = $images.find(i => i.id.startsWith('sha256:' + $page.params.id));

</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Information</h2>
		<p>
			Tags({image?.tags.length}):
			<span class="font-bold">{image?.tags.join(', ')}</span>
		</p>
		<p>
			ID:
			<span class="font-bold">{image?.id}</span>
		</p>
	</div>
</div>

<style lang="scss">

</style>
