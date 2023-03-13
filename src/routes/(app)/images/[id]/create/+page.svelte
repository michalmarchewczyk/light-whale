<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import FormInput from '$lib/client/components/forms/FormInput.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import PlusIcon from '$icons/plus.svg';

	let loading = false;

	export let form: ActionData;
</script>

<svelte:head>
	<title>Create From Image - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title">Create container</h2>
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<FormError error={form?.error} />
			<FormInput label="Container name" placeholder="name" name="name" />
			<FormInput label="Command" placeholder="command" name="command" />
			<label class="w-full flex flex-row justify-between items-center mt-6 mb-6">
				<span class="font-semibold text-lg">Automatic restarts</span>
				<input type="checkbox" name="restart" class="toggle toggle-primary" checked />
			</label>
			<div class="card-actions mt-4">
				<ActionButton {loading} class="w-auto" icon={PlusIcon}>Create</ActionButton>
			</div>
		</form>
	</div>
</div>
