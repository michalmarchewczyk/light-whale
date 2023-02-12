<script lang="ts">
	import Background from '$lib/client/assets/background.svg';
	import Logotype from '$lib/client/assets/logotype_white.png';
	import FormPassword from '$lib/client/components/forms/FormPassword.svelte';
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<div class="fixed top-0 left-0 h-screen w-screen">
	<Background class="absolute top-0 left-0 h-5/6 w-auto" />
	<img src={Logotype} class="absolute h-20 w-auto top-8 left-8" alt="Light-Whale" />
</div>
<div class="flex w-screen h-screen justify-center items-center">
	<div class="card shadow-xl w-80 bg-base-100">
		<div class="card-body">
			<h1 class="card-title">Login</h1>
			<form method="POST" use:enhance>
				<FormError error={form?.passwordError} />
				<FormPassword label="Password" placeholder="password" name="password" />
				<div class="card-actions">
					<input class="btn btn-primary mt-2" type="submit" value="Login" />
				</div>
			</form>
		</div>
	</div>
</div>

<style lang="scss">
</style>
