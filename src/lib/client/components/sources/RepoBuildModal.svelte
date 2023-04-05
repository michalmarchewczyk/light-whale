<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import type Repo from '$lib/server/sources/git/Repo';
	import { enhance } from '$app/forms';
	import Portal from '$lib/client/components/Portal.svelte';

	export let open = false;
	export let repo: Repo;

	let selectedFile = repo?.dockerInfo.topFile ?? '';
	$: isComposeFile = selectedFile?.includes('compose') ?? false;

	let name = '';
	let loading = false;

	let envVars: Record<string, string> = {};

	$: envVarsNames =
		repo?.dockerInfo.files?.find((file) => file.file === selectedFile)?.envVars ?? [];

	$: if (envVarsNames.length > 0) {
		if (envVarsNames.join(' ') !== Object.keys(envVars).join(' ')) {
			envVarsNames.forEach((name) => {
				envVars[name] = '';
			});
		}
	} else {
		envVars = {};
	}

	export let form: { error: string };

	let nameInput: HTMLInputElement;
</script>

<Portal>
	<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open} />
	<div class="modal">
		<form
			class="modal-box overflow-y-visible"
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update({});
				};
			}}
			action="/sources/git/{encodeURIComponent(repo?.gitInfo.remoteUrl)}?/build"
		>
			<span class="text-xl mb-6 font-semibold w-full block"
				>Build {isComposeFile ? 'app' : 'image'}</span
			>
			<label class="pl-0 flex flex-1 space-x-2 mr-2 mb-4">
				<input type="hidden" name="file" bind:value={selectedFile} />
				<span class="text-lg mb-0 mt-2">File: </span>
				<div class="dropdown flex-1">
					<button class="select select-bordered bg-base-100 align-middle ml-2 w-full" type="button">
						<span class="mt-2 text-base">{selectedFile}</span>
					</button>
					<ul
						class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full ml-2"
					>
						{#each repo?.dockerInfo.files?.map((file) => file.file) as val}
							<li>
								<button
									on:click={() => {
										selectedFile = val;
										nameInput.focus();
									}}
									type="button">{val}</button
								>
							</li>
						{/each}
					</ul>
				</div>
			</label>
			<label class="pl-0 flex flex-1 space-x-4">
				<span class="text-lg mb-0 mt-2">Name: </span>
				<input
					bind:value={name}
					class="input input-bordered w-full text-base"
					placeholder="name"
					name="name"
					type="text"
					bind:this={nameInput}
				/>
			</label>
			{#if envVarsNames.length > 0}
				<span class="text-lg font-semibold mb-4 mt-6 w-full block"
					>Set values for detected {isComposeFile
						? 'environment variables'
						: 'build arguments'}:</span
				>
				{#each envVarsNames as envVar}
					<label class="input-group pl-0 mb-2">
						<span class="">{envVar} =</span>
						<input
							bind:value={envVars[envVar]}
							class="input input-bordered text-base flex-1 ml-0"
							placeholder="value"
							name="envVars_{envVar}"
							type="text"
						/>
					</label>
				{/each}
			{/if}
			{#if isComposeFile}
				<label class="w-full flex flex-row justify-between items-center mt-6">
					<span class="font-semibold text-lg">Automatic restarts</span>
					<input type="checkbox" name="restart" class="toggle toggle-primary" checked />
				</label>
			{/if}
			<FormError error={form?.error} />
			<div class="modal-action">
				<button class="btn" on:click={() => (open = false)} type="button">Cancel</button>
				<button class="btn btn-primary" class:loading disabled={!name || loading}>
					{isComposeFile ? 'Create' : 'Build'}
				</button>
			</div>
		</form>
	</div>
</Portal>
