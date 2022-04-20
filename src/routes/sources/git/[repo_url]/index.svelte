<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import {page} from '$app/stores';
</script>

<svelte:head>
	<title>Sources / Git</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<ListHeader title="Sources / Git / {$page.params.repo_url}">
	</ListHeader>
	<div class="p-8 pt-2">

	</div>
</div>


<style lang="scss">

</style>
