<script lang="ts">
	import { enhance } from '$app/forms';
	import Portal from '$lib/client/components/Portal.svelte';

	export let loading = false;
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

<Portal>
	<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open} />
	<div class="modal">
		<form
			class="modal-box"
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					open = false;
					loading = false;
					update();
				};
			}}
			action="/images?/pull"
		>
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
				<button class="btn btn-primary" disabled={!selected || loading} class:loading>
					Pull
				</button>
			</div>
		</form>
	</div>
</Portal>
