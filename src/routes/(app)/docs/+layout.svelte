<script lang="ts">
	import { page } from '$app/stores';

	export let data: { docs: { title: string; path: string }[] };
</script>

<div class="max-w-5xl mx-auto text-base-content flex pt-8 pb-8">
	<ul class="w-48 menu menu-compact rounded-box p-2 px-0 sticky top-4 self-start">
		{#each data.docs as doc}
			<li>
				<a
					href={doc.path}
					class:font-bold={$page.url.pathname === doc.path}
					style="margin-left: {Math.max(0, doc.path.split('/').length - 3) * 0.75}rem"
				>
					{doc.title}
				</a>
			</li>
		{/each}
	</ul>
	<div class="divider divider-horizontal" />
	<div class="flex-1 pb-4"><slot /></div>
</div>
