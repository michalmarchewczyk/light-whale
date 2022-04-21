<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';

	export let fetchItems;

	let error = '';
	let loading = false;

	let address = '';

	const submit = async () => {
		if(address === ''){
			return;
		}
		error = '';
		loading = true;
		const res = await fetch(`/api/sources/git/${encodeURIComponent(address)}`);
		if(res.status !== 200){
			error = 'Could not fetch git repository from address';
			loading = false;
			return;
		}
		fetchItems();
		loading = false;
	};
</script>

<div class="card shadow-lg bg-base-100 mb-6 mt-4">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Pull repository</h2>
		<form on:submit|preventDefault={submit}>
			<FormError error={error}/>
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 ">Address: </span>
						<input bind:value={address} on:input={() => error = ''} class="input input-bordered w-full text-base" placeholder="address"
							   type="text">
					</label>
					<button class="flex-none btn btn-primary cursor-pointer" disabled={loading} class:loading={loading}>
						Pull
					</button>
				</div>
			</div>
		</form>
	</div>
</div>

<style lang="scss">

</style>
