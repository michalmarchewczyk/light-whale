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

	let password = '';

	let error = '';

	const submit = async () => {
		const body = JSON.stringify({password});
		const res = await fetch('/login/login', {method: 'POST', body});
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
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-2 stroke-current" fill="none"
								 viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
							</svg>
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
