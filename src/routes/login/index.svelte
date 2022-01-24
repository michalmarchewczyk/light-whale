<script lang="ts">
	import {goto} from '$app/navigation';
	import {session} from '$app/stores';

	import FormError from '$lib/components/forms/FormError.svelte';
	import FormPassword from '$lib/components/forms/FormPassword.svelte';

	let password = '';

	let error = '';

	const submit = async () => {
		const res = await fetch('/login/login', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({password})
		});
		const data = await res.json();
		if (res.status !== 200) {
			error = 'Wrong password';
		} else {
			$session = {id: data.session.id};
			await goto('/');
		}
	};
</script>

<div class="card shadow-lg w-80 bg-base-100">
	<div class="card-body">
		<h1 class="card-title">Login</h1>
		<form on:submit|preventDefault={submit}>
			<FormError error={error}/>
			<FormPassword label="Password" placeholder="password" bind:value={password}/>
			<div class="card-actions">
				<input class="btn btn-primary" type="submit" value="Login"/>
			</div>
		</form>
	</div>
</div>




