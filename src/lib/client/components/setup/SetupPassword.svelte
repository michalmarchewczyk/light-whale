<script lang="ts">
	import {goto} from '$app/navigation';
	import {createEventDispatcher} from 'svelte';
	import FormPassword from '$lib/client/components/forms/FormPassword.svelte';

	const dispatch = createEventDispatcher();

	let loading = false;
	let password = '';

	const setPassword = async () => {
		loading = true;
		const res = await fetch('/api/setup', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({stage: 'no-password', password})
		});
		const status = await res.json();
		loading = false;
		dispatch('setupChange', status);
		if(status.stage === 'done'){
			await goto('/login');
		}
	};
</script>


<h2 class="text-2xl font-bold mb-8">Setup password</h2>
<p>
	Setup password for Light-Whale's panel:
</p>
<form on:submit|preventDefault={setPassword}>
	<FormPassword label="Password" placeholder="password" class="mt-4 mb-6" bind:value={password}/>
	<div class="flex-row-reverse card-actions justify-between self-end bottom-0 mt-4">
		<button type="submit" class="btn btn-primary text-base" class:loading="{loading}" disabled="{loading}">
			Save
		</button>
	</div>
</form>
