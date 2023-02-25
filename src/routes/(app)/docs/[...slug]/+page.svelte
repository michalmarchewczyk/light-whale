<script lang="ts">
	import { marked } from 'marked';

	export let data: { raw: string; title: string };

	$: htmlCode = marked(data?.raw ?? '', {
		baseUrl: '/docs/'
	});
</script>

<svelte:head>
	<title>{data.title} - Light-Whale Docs</title>
</svelte:head>

<div class="prose">
	{@html htmlCode}
</div>

<style lang="scss">
</style>
