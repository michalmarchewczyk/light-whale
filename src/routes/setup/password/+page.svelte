<script lang="ts">
	import validator from 'validator';
	import FormPassword from '$lib/client/components/forms/FormPassword.svelte';
	import { enhance } from '$app/forms';

	let loading = false;
	let password = '';

	let strength;
	const checkPasswordStrength = () => {
		strength = validator.isStrongPassword(password, {
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			returnScore: true
		});
	};
	checkPasswordStrength();
</script>

<svelte:head>
	<title>Password Setup - Light-Whale</title>
</svelte:head>

<h2 class="text-2xl font-bold mb-8">Setup password</h2>
<p>Setup password for Light-Whale's panel:</p>
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
	<FormPassword
		label="Password"
		placeholder="password"
		name="password"
		class="mt-4 mb-6"
		bind:value={password}
		on:input={checkPasswordStrength}
	/>
	{#if strength < 42}
		<span class="text-error mr-2 font-semibold uppercase">weak</span>
		<progress value={strength} max="80" class="progress progress-error w-40" />
	{:else if strength < 50}
		<span class="text-warning mr-2 font-semibold uppercase">fair</span>
		<progress value={strength} max="80" class="progress progress-warning w-40" />
	{:else if strength < 65}
		<span class="text-success mr-2 font-semibold uppercase">good</span>
		<progress value={strength} max="80" class="progress progress-success w-40" />
	{:else}
		<span class="text-success mr-2 font-semibold uppercase">strong</span>
		<progress value={strength} max="80" class="progress progress-success w-40" />
	{/if}

	<div class="flex-row-reverse card-actions justify-between self-end bottom-0 mt-4">
		<button
			type="submit"
			class="btn btn-primary text-base"
			class:loading
			disabled={loading || strength < 42}
		>
			Save
		</button>
	</div>
</form>

<style lang="scss">
</style>
