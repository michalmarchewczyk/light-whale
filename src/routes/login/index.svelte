<script context="module" lang="ts">
	import type {LoadInput, LoadOutput} from '@sveltejs/kit';

	export async function load({session}:LoadInput):Promise<LoadOutput> {
		if (session.id) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {
			props: {}
		};
	}
</script>

<script lang="ts">
	import {goto} from '$app/navigation';
	import {session} from '$app/stores';

	import ExclamationIcon from '$icons/exclamation.svg';

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

<svelte:head>
	<title>Login - Docker Control Panel</title>
</svelte:head>

<div class="flex w-screen h-screen justify-center items-center">
	<div class="card shadow-lg w-80 bg-base-100">
		<div class="card-body">
			<h1 class="card-title">Login</h1>
			<form on:submit|preventDefault={submit}>
				{#if error}
					<div class="alert alert-error my-2">
						<div class="flex-1">
							<ExclamationIcon class="h-6 w-6 mx-2 stroke-2" />
							<span>{error}</span>
						</div>
					</div>
				{/if}
				<div class="form-control">
					<label>
					<span class="label pl-0">
						<span class="label-text text-lg mb-0">Password: </span>
					</span>
						<input type="password" placeholder="password" class="input input-bordered w-full"
							   bind:value={password}>
					</label>
				</div>
				<div class="card-actions">
					<input type="submit" value="Login" class="btn btn-primary"/>
				</div>
			</form>
		</div>
	</div>
</div>


<style lang="scss">
  :global(body) {
	@apply bg-base-200 w-screen h-screen;
  }
</style>
