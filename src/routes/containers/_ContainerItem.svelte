<script lang="ts">
	import type {Container} from '$lib/stores/docker';

	export let container:Container;
</script>

<div class="card shadow-lg my-4 bg-base-100 p-4">
	<span class="font-bold text-lg w-60 overflow-hidden overflow-ellipsis whitespace-nowrap">{container.names.join(', ')}</span>
	<span class="w-60 overflow-hidden overflow-ellipsis whitespace-nowrap">{container.id}</span>
	<span class="w-60 overflow-hidden overflow-ellipsis whitespace-nowrap">{container.imageName}</span>
	<span class="w-60 overflow-hidden overflow-ellipsis whitespace-nowrap">{container.status}</span>
</div>

<style lang="scss">

</style>
