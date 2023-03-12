<script lang="ts">
	import { marked } from 'marked';
	import ChevronLeftIcon from '$icons/chevron-left.svg';
	import ChevronRightIcon from '$icons/chevron-right.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';

	export let data: {
		raw: string;
		title: string;
		next: { title: string; path: string };
		prev: { title: string; path: string };
	};

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
	pb-4
"
>
	{@html htmlCode}
</div>
<div class="divider" />
<div class="flex flex-row justify-between">
	{#if data.prev}
		<ActionButton icon={ChevronLeftIcon} class="w-auto btn-ghost pr-4" href={data.prev.path}>
			{data.prev.title}
		</ActionButton>
	{:else}
		<div />
	{/if}
	{#if data.next}
		<ActionButton
			icon={ChevronRightIcon}
			iconPosition="right"
			class="w-auto btn-ghost pl-4"
			href={data.next.path}
		>
			{data.next.title}
		</ActionButton>
	{/if}
</div>

<style lang="scss">
</style>
