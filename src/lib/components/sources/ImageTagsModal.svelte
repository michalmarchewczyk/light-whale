<script lang="ts">
	export let open = false;
	export let name = '';
	let tags = [];
	let selected = 'latest';

	const fetchTags = async (name) => {
		const res = await fetch(`/sources/dockerhub/tags?image=${name}`);
		if(res.status !== 200){
			return;
		}
		const data = await res.json();
		tags = data['results'] ?? [];
	};

	$: {
		if(name && open){
			fetchTags(name);
		}
	}
</script>

<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open}>
<div class="modal">
	<div class="modal-box">
		<span class="text-lg mb-4 font-semibold w-full block">Select tag to pull</span>
		<select class="select select-bordered w-full max-w-xs text-base" bind:value={selected}>
			{#each tags as tag}
				<option>{tag['name']}</option>
			{/each}
		</select>

		<div class="modal-action">
			<button class="btn btn-primary" on:click={() => {
						open = false;
						console.log('pull', selected);
					}} disabled={!selected}>
				Pull
			</button>
			<button class="btn" on:click={() => open = false}>Cancel</button>
		</div>
	</div>
</div>

<style lang="scss">

</style>
