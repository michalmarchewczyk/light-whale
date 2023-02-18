<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let error = '';
	let loading = false;
	let address = '';

	let submitButton;

	let pullUrl;
	$: pullUrl = $page.url.searchParams.get('pull');
	$: if (pullUrl) {
		address = pullUrl;
		submitButton?.click();
	}
</script>

<div class="card shadow-lg bg-base-100 mb-6 mt-4">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Pull repository</h2>
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
			action="/sources/git?/pull"
		>
			<input type="hidden" name="remoteUrl" bind:value={address} />
			<FormError {error} />
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 ">Address: </span>
						<input
							bind:value={address}
							on:input={() => (error = '')}
							class="input input-bordered w-full text-base"
							placeholder="address"
							type="text"
						/>
					</label>
					<button
						class="flex-none btn btn-primary cursor-pointer"
						disabled={loading}
						class:loading
						bind:this={submitButton}
					>
						Pull
					</button>
				</div>
			</div>
		</form>
	</div>
</div>
