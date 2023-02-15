<script lang="ts">
	import type ContainerData from '$lib/server/docker/ContainerData';
	import type ImageData from '$lib/server/docker/ImageData';

	export let data: { image: ImageData; imageContainers: ContainerData[] };
</script>

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
