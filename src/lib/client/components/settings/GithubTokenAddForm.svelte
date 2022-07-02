<script lang="ts">

	import {createEventDispatcher} from 'svelte';

	const dispatch = createEventDispatcher();

	let loading = false;
	let pat = '';
	let description = '';
	let password = '';

	const addPAT = async () => {
		loading = true;
		const res = await fetch('/api/auth/tokens', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({service: 'github', token: pat, description, password: password})
		});
		loading = false;
		if(res.status !== 200){
			return;
		}
		pat = '';
		description = '';
		password = '';
		dispatch('refresh');
	};
</script>

<form on:submit|preventDefault={addPAT}>
	<span class="text-lg font-semibold mb-4 block">Add PAT</span>
	<div class="flex space-x-4">
		<label class="input-group flex-1">
			<span>Token: </span>
			<input bind:value={pat} type="text" placeholder="token" class="input input-bordered text-base w-full" />
		</label>
		<label class="input-group flex-1">
			<span>Description: </span>
			<input bind:value={description} type="text" placeholder="description" class="input input-bordered text-base w-full" />
		</label>
	</div>
	<div class="flex space-x-4 mt-4 w-full justify-end">
		<label class="pl-0 flex flex-0 space-x-4">
			<span class="text-lg mb-0 mt-2 whitespace-nowrap">Confirm Password: </span>
			<input bind:value={password} class="input input-bordered w-full text-base" placeholder="password"
				   type="password">
		</label>
		<button class="flex-none btn btn-primary cursor-pointer" disabled={loading} class:loading={loading}>
			Add
		</button>
	</div>
</form>

<style lang="scss">

</style>
