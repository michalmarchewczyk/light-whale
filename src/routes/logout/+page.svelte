<script lang="ts">
	import Background from '$lib/client/assets/background.svg';
	import Logotype from '$lib/client/assets/logotype_white.png';
</script>

<svelte:head>
	<title>Logout - Light-Whale</title>
</svelte:head>

<div class="fixed top-0 left-0 h-screen w-screen">
	<Background class="absolute top-0 left-0 h-5/6 w-auto" />
	<img src={Logotype} class="absolute h-16 w-auto top-8 left-8" alt="Light-Whale" />
</div>
<div class="flex w-screen h-screen justify-center items-center">
	<div class="card shadow-xl w-80 bg-base-100">
		<div class="card-body">
			<h1 class="card-title mb-2">Logout</h1>
			<span>You have been logged out</span>
			<div class="card-actions">
				<a class="btn btn-primary mt-4" href="/login">Login again</a>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
</style>
