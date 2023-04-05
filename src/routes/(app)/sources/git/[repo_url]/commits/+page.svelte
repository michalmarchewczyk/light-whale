<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="card shadow-md bg-base-100 p-0 max-h-[calc(100vh-18rem)] overflow-hidden">
	<span class="mx-0 p-2 px-5 font-bold text-lg border-b-2 mb-0">
		<span class="block py-1">Commits history</span>
	</span>
	<div class="p-0 overflow-y-scroll overflow-x-hidden">
		<table class="table table-compact table-fixed table-zebra w-full overflow-hidden max-w-full">
			<thead>
				<tr>
					<th class="pl-4 w-24 rounded-none">Hash</th>
					<th class="w-1/4 px-0">Author</th>
					<th class="px-0 pl-4">Message</th>
					<th class="pr-4 w-48 pl-8 rounded-none">Date</th>
				</tr>
			</thead>
			<tbody class="overflow-hidden max-w-full w-full">
				{#each data.commits as commit}
					<tr class="max-w-full w-full">
						<td class="pl-4"><span>{commit.hash}</span></td>
						<td class="relative p-0">
							<span class="absolute top-2 left-0 overflow-hidden overflow-ellipsis w-full">
								{commit.authorName} &lt;{commit.authorEmail}&gt;
							</span>
						</td>
						<td class="relative p-0">
							<span class="absolute top-2 left-4 overflow-hidden overflow-ellipsis w-full">
								{commit.message}
							</span>
						</td>
						<td class="pr-4 pl-8"><span>{new Date(commit.date).toLocaleString()}</span></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="scss">
	//table {
	//	@apply block;
	//}
</style>
