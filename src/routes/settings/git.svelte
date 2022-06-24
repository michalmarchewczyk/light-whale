<script lang="ts">
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import TrashIcon from '$icons/trash.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';

	let pat = '';
	let description = '';
	let password = '';
	let loading = false;

	const getTokensInfo = async () => {
		const res = await fetch('/api/auth/github');
		if(res.status !== 200){
			return;
		}
		return await res.json();
	};

	let get = getTokensInfo;

	const addPAT = async () => {
		loading = true;
		const res = await fetch('/api/auth/tokens', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({service: 'github', token: pat, description, password: password})
		});
		loading = false;
		get = getTokensInfo;
	};

	const removePAT = async (id:string) => {
		loading = true;
		const res = await fetch('/api/auth/tokens', {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({id})
		});
		loading = false;
		get = getTokensInfo;
	};
</script>

<svelte:head>
	<title>Git Settings</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Github Personal Access Tokens</h2>
		<table class="table w-full mt-4 mb-0">
			<tbody>
				{#await get()}
					<p class="w-full text-center text-3xl p-4 opacity-50">Loading...</p>
				{:then tokensInfo}
					{#each tokensInfo as info}
						<tr>
							<td>
								<div class="flex items-center space-x-3">
									<div class="avatar">
										<div class="rounded-md w-16 h-16">
											<img src="{info.avatarUrl}" alt="Avatar Tailwind CSS Component" />
										</div>
									</div>
									<div>
										<div class="text-lg font-bold">{info.name}</div>
										<div class="text-base opacity-50">{info.login}</div>
									</div>
								</div>
							</td>
							<td class="w-80">
								<span class="w-80 {info.description ? '' : 'italic'} block mb-1 overflow-hidden overflow-ellipsis">
									{info.description.length ? decodeURIComponent(info.description) : 'no description'}
								</span>
								<ItemInfo class="w-48" icon={CalendarIcon}>{new Date(info.date).toLocaleString()}</ItemInfo>
							</td>

							<td>
								<ActionButton class="w-32 float-right" loading={loading} on:click={() => removePAT(info.id)} icon={TrashIcon}>
									Remove
								</ActionButton>
							</td>
						</tr>
					{:else}
						<p class="w-full text-center text-3xl p-4 opacity-50">No tokens saved</p>
					{/each}
				{/await}
			</tbody>
		</table>
		<div class="divider mb-0 mt-0"></div>
		<form on:submit|preventDefault={addPAT}>
			<span class="text-lg font-semibold mb-4 block">Add PAT</span>
			<div class="flex space-x-4">
				<label class="input-group flex-1">
					<span>Token: </span>
					<input bind:value={pat} type="text" placeholder="token" class="input input-bordered text-base w-full" />
				</label>
				<label class="input-group flex-1">
					<span>Description: </span>
					<input bind:value={description} type="text" placeholder="token" class="input input-bordered text-base w-full" />
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
	</div>
</div>


<style lang="scss">

</style>
