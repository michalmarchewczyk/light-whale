<script lang="ts">
	import type {Image} from '$lib/client/stores/images';
	import { images} from '$lib/client/stores/images';
	import {page} from '$app/stores';
	import {createContainer} from '$lib/client/stores/containers';
	import {goto} from '$app/navigation';
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import FormInput from '$lib/client/components/forms/FormInput.svelte';

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
		<h2 class="card-title">Create container</h2>
		<form on:submit|preventDefault={submit}>
			<FormError error={error} />
			<FormInput label="Container name" placeholder="name" bind:value={name}/>
			<FormInput label="Command" placeholder="command" bind:value={command}/>
			<div class="card-actions mt-4">
				<input class="btn btn-primary" type="submit" value="Create"/>
			</div>
		</form>
	</div>
</div>

<style lang="scss">

</style>
