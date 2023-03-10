<script lang="ts">
	import CheckStatusIcon from '$lib/client/components/CheckStatusIcon.svelte';

	export let status = '';
	export let title = '';
	export let msg = '';
</script>

<div class="card shadow-md bg-base-100 mb-4 min-h-24 card-side {$$props.class}">
	<figure class="pt-0 pl-2">
		<CheckStatusIcon {status} />
	</figure>
	<div class="card-body p-4 pt-4 pb-5 pl-4">
		<h2 class="card-title text-xl mb-0">{title}</h2>
		<p class="whitespace-pre-line">
			{msg}
		</p>
	</div>
	<div class="pr-5 flex flex-col justify-center">
		<slot />
	</div>
</div>
