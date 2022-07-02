<script lang="ts">
	import GithubTokenAddForm from '$lib/client/components/settings/GithubTokenAddForm.svelte';
	import GithubTokenItem from '$lib/client/components/settings/GithubTokenItem.svelte';

	const getTokensInfo = async () => {
		const res = await fetch('/api/auth/github');
		if(res.status !== 200){
			return;
		}
		return await res.json();
	};

	let get = getTokensInfo;
</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Github Personal Access Tokens</h2>
		<table class="table w-full mt-4 mb-0">
			<tbody>
				{#await get()}
					<p class="w-full text-center text-3xl p-4 opacity-50">Loading...</p>
				{:then tokensInfo}
					{#each tokensInfo as info}
						<GithubTokenItem info={info} on:refresh={() => get = getTokensInfo}/>
					{:else}
						<p class="w-full text-center text-3xl p-4 opacity-50">No tokens saved</p>
					{/each}
				{/await}
			</tbody>
		</table>
		<div class="divider mb-0 mt-0"></div>
		<GithubTokenAddForm on:refresh={() => get = getTokensInfo}/>
	</div>
</div>


<style lang="scss">

</style>
