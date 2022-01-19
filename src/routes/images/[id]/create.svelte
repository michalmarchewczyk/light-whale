<script lang="ts">
	import {Image, images} from '$lib/stores/images';
	import {page} from '$app/stores';
	import ExclamationIcon from '$icons/exclamation.svg';
	import {createContainer} from '$lib/stores/containers';
	import {goto} from '$app/navigation';

	let image:Image;

	$: image = $images.find(i => i.id.startsWith('sha256:' + $page.params.id));

	let error = '';
	let name = '';
	let command = '';

	const submit = async () => {
		await createContainer(image?.id, name, command);
		await goto(`/images/${image.id.substring(7, 19)}/containers`);
	};
</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Create container</h2>
		<form on:submit|preventDefault={submit}>
			{#if error}
				<div class="alert alert-error my-2">
					<div class="flex-1">
						<ExclamationIcon class="h-6 w-6 mx-2 stroke-2"/>
						<span>{error}</span>
					</div>
				</div>
			{/if}
			<div class="form-control">
				<label>
					<span class="label pl-0">
						<span class="label-text text-lg mb-0">Container name: </span>
					</span>
					<input bind:value={name} class="input input-bordered w-full" placeholder="name"
						   type="text">
				</label>
			</div>
			<div class="form-control">
				<label>
					<span class="label pl-0">
						<span class="label-text text-lg mb-0">Command: </span>
					</span>
					<input bind:value={command} class="input input-bordered w-full" placeholder="command"
						   type="text">
				</label>
			</div>
			<div class="card-actions">
				<input class="btn btn-primary" type="submit" value="Create"/>
			</div>
		</form>
	</div>
</div>

<style lang="scss">

</style>
