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

	let envVars:Record<string, string> = {};

	if(repo?.envVariables?.length > 0){
		repo.envVariables.forEach(envVar => {
			envVars[envVar] = '';
		});
	}

	const build = async() => {
		loading = true;
		const res = await fetch(`/api/sources/git/${encodeURIComponent(repo.remoteName)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({name, envVariables: envVars})
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
		<span class="text-xl mb-6 font-semibold w-full block">Build {isComposeFile ? 'app' : 'image'}</span>
		<FormError error={error} class="mb-4"/>
		<label class="pl-0 flex flex-1 space-x-4">
			<span class="text-lg mb-0 mt-2 ">Name: </span>
			<input bind:value={name} on:input={() => error = ''} class="input input-bordered w-full text-base" placeholder="name"
				   type="text">
		</label>
		{#if repo.envVariables?.length > 0}
			<span class="text-lg font-semibold mb-4 mt-6 w-full block">Set values for detected environment variables:</span>
			{#each repo.envVariables as envVar}
				<label class="pl-0 flex flex-1 space-x-4 mb-2">
					<span class="text-lg mb-0 mt-2">{envVar} =</span>
					<input bind:value={envVars[envVar]} class="input input-bordered text-base flex-1 ml-0" placeholder="value" type="text">
				</label>
			{/each}
		{/if}
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
