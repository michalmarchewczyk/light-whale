<script lang="ts">
	import CheckStatusIcon from '$lib/components/CheckStatusIcon.svelte';

	export let status = '';
	export let title = '';
	export let msg = '';
</script>

<div class="card shadow-md bg-base-100 mb-4 h-24 card-side {$$props.class}">
	<figure class="pt-0 pl-2">
		<CheckStatusIcon status="{status}"/>
	</figure>
	<div class="card-body p-6 pt-4 pl-4">
		<h2 class="card-title text-xl mb-0">{title}</h2>
		<p>
			{msg}
		</p>
	</div>
</div>

<style lang="scss">

</style>
