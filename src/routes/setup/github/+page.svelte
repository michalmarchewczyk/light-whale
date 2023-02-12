<script lang="ts">
	let pat = '';
	let description = '';
	let loading = false;
</script>

<h2 class="text-2xl font-bold mb-8">Setup Github account</h2>
<p>
	You can connect your Github account in order to more easily create containers from your
	repositories.
	<br />
	You can always do that later in settings.
	<br />
</p>
<br />
<p>
	To connect your Github account, you need to
	<a
		href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
		class="font-bold underline"
		target="_blank"
		rel="noreferrer"
	>
		create a new Personal Access Token
	</a>
	with <span class="font-bold">repo</span> permissions.
</p>
<br />
<form>
	<span class="text-lg font-semibold mb-4 block">Add PAT</span>
	<div class="flex space-x-4">
		<label class="input-group flex-1">
			<span>Token: </span>
			<input
				bind:value={pat}
				type="text"
				placeholder="token"
				class="input input-bordered text-base w-full"
			/>
		</label>
		<label class="input-group flex-1">
			<span>Description: </span>
			<input
				bind:value={description}
				type="text"
				placeholder="token"
				class="input input-bordered text-base w-full"
			/>
		</label>
	</div>
</form>
<div class="flex-row-reverse card-actions justify-between self-end bottom-0 mt-8">
	<div>
		<button class="btn btn-primary text-base" disabled={!pat || loading} class:loading>Next</button>
	</div>
	<a class="btn btn-primary text-base" href="/setup/password">Skip</a>
</div>

<style lang="scss">
</style>
