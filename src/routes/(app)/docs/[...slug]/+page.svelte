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

<div
	class="prose w-full max-w-full
	prose-img:rounded-xl prose-img:border-2 prose-img:border-neutral prose-img:bg-base-100
	hover:prose-a:text-primary-focus
	prose-h2:text-[2rem]
	prose-p:my-1
	prose-li:my-0.5
	leading-6
"
>
	{@html htmlCode}
</div>

<style lang="scss">
</style>
