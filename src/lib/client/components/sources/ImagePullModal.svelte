<script lang="ts">
	import { enhance } from '$app/forms';

	export let open = false;
	export let name = '';

	let tags = [];
	let selected = 'latest';
	const fetchTags = async (name) => {
		const res = await fetch(`/sources/dockerhub?image=${name}`);
		if (res.status !== 200) {
			return;
		}
		const data = await res.json();
		if (data.error) {
			return;
		}
		tags = data;
	};
	$: {
		if (name && open) {
			fetchTags(name);
		}
	}
</script>

<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open} />
<div class="modal">
	<form class="modal-box" method="POST" use:enhance action="/images?/pull">
		<input type="hidden" name="image" value={name} />
		<span class="text-lg mb-4 font-semibold w-full block">Select tag to pull</span>
		<select
			class="select select-bordered w-full max-w-xs text-base"
			bind:value={selected}
			name="tag"
		>
			{#each tags as tag}
				<option>{tag['name']}</option>
			{/each}
		</select>
		<div class="modal-action">
			<button class="btn" on:click={() => (open = false)} type="button">Cancel</button>
			<button
				class="btn btn-primary"
				on:click={() => {
					open = false;
				}}
				disabled={!selected}
			>
				Pull
			</button>
		</div>
	</form>
</div>
