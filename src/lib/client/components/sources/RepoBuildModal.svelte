<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import {goto} from '$app/navigation';
	import {fetchImages} from '$lib/client/stores/images';

	export let open = false;
	export let repo;

	let selectedFile = repo?.topFile ?? '';
	$: isComposeFile = selectedFile?.includes('compose') ?? false;

	let name = '';
	let error = '';
	let loading = false;

	let envVars:Record<string, string> = {};

	$: envVarsNames = repo?.files?.find(file => file.file === selectedFile)?.envVars ?? [];

	$: if(envVarsNames.length > 0){
		if(envVarsNames.join(' ') !== Object.keys(envVars).join(' ')){
			envVarsNames.forEach(name => {
				envVars[name] = '';
			});
		}
	}else{
		envVars = {};
	}

	const build = async() => {
		loading = true;
		const res = await fetch(`/api/sources/git/${encodeURIComponent(repo.remoteName)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({name, selectedFile, envVariables: envVars})
		});
		loading = false;
		if(res.status === 400){
			error = 'Image/app name is invalid';
			return;
		}
		if(res.status === 409){
			error = 'Image/app name is already taken';
			return;
		}
		if(res.status !== 200){
			error = 'There was an error building an' + isComposeFile ? 'app' : 'image';
			return;
		}
		const data = await res.json();
		open = false;
		await fetchImages();
		await goto(`/images/${data.id.substring(7, 19)}`);
	};
</script>

<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open}>
<div class="modal">
	<div class="modal-box overflow-y-visible">
		<span class="text-xl mb-6 font-semibold w-full block">Build {isComposeFile ? 'app' : 'image'}</span>
		<label class="pl-0 flex flex-1 space-x-2 mr-2 mb-4">
			<span class="text-lg mb-0 mt-2 ">File: </span>
			<div class="dropdown flex-1">
				<button class="select select-bordered bg-base-100 align-middle ml-2 w-full">
					<span class="mt-2 text-base">{selectedFile}</span>
				</button>
				<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full ml-2">
					{#each repo?.files?.map(file => file.file) as val}
						<li>
							<button on:click={() => selectedFile = val}>{val}</button>
						</li>
					{/each}
				</ul>
			</div>
		</label>
		<FormError error={error} class="mb-4"/>
		<label class="pl-0 flex flex-1 space-x-4">
			<span class="text-lg mb-0 mt-2 ">Name: </span>
			<input bind:value={name} on:input={() => error = ''} class="input input-bordered w-full text-base" placeholder="name"
				   type="text">
		</label>
		{#if envVarsNames.length > 0}
			<span class="text-lg font-semibold mb-4 mt-6 w-full block">Set values for detected environment variables:</span>
			{#each envVarsNames as envVar}
				<label class="input-group pl-0 mb-2">
					<span class="">{envVar} =</span>
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
