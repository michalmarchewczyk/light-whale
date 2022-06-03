<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import {goto} from '$app/navigation';
	import {fetchImages} from '$lib/client/stores/images';

	export let open = false;
	export let repo;
	$: isComposeFile = !repo?.topFileContent.startsWith('FROM');

	let name = '';
	let error = '';
	let loading = false;

	const build = async() => {
		loading = true;
		const res = await fetch(`/api/sources/git/${encodeURIComponent(repo.remoteName)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({name})
		});
		if(res.status !== 200){
			error = 'There was an error building an' + isComposeFile ? 'app' : 'image';
			loading = false;
			return;
		}
		const data = await res.json();
		loading = false;
		open = false;
		await fetchImages();
		await goto(`/images/${data.id.substring(7, 19)}`);
	};
</script>

<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open}>
<div class="modal">
	<div class="modal-box">
		<span class="text-lg mb-4 font-semibold w-full block">Build {isComposeFile ? 'app' : 'image'}</span>
		<FormError error={error} class="mb-4"/>
		<label class="pl-0 flex flex-1 space-x-4">
			<span class="text-lg mb-0 mt-2 ">Name: </span>
			<input bind:value={name} on:input={() => error = ''} class="input input-bordered w-full text-base" placeholder="name"
				   type="text">
		</label>
		<div class="modal-action">
			<button class="btn" on:click={() => open = false}>Cancel</button>
			<button class="btn btn-primary" class:loading={loading} on:click={() => {
						build();
					}} disabled={!name || loading}>
				{isComposeFile ? 'Create' : 'Build'}
			</button>
		</div>
	</div>
</div>

<style lang="scss">

</style>
