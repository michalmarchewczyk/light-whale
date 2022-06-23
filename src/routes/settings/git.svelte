<script lang="ts">
	let pat = '';
	let password = '';
	let loading = false;

	const addPAT = async () => {
		loading = true;
		const res = await fetch('/api/auth/tokens', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({service: 'github', token: pat, password: password})
		});
		loading = false;
	};
</script>

<svelte:head>
	<title>Git Settings</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Github Personal Access Tokens</h2>
		<form on:submit|preventDefault={addPAT}>
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 whitespace-nowrap">Add PAT: </span>
						<input bind:value={pat} class="input input-bordered w-full text-base" placeholder="token"
							   type="text">
					</label>
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 whitespace-nowrap">Confirm Password: </span>
						<input bind:value={password} class="input input-bordered w-full text-base" placeholder="password"
							   type="password">
					</label>
					<button class="flex-none btn btn-primary cursor-pointer" disabled={loading} class:loading={loading}>
						Add
					</button>
				</div>
			</div>
		</form>
	</div>
</div>


<style lang="scss">

</style>
