<script lang="ts">
	import {containers} from '$lib/stores/containers';
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<div class="bg-base-200 top-0 sticky z-40">
		<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
			Containers
			<div class="badge badge-lg float-right mt-1 text-lg h-8">
				{$containers.filter(c => c.state === 'running').length} / {$containers.length} running
			</div>
		</div>

	</div>

	<div class="p-8 pt-2">
		<slot></slot>
	</div>
</div>

<style lang="scss">

</style>
