<script lang="ts">
	import { enhance } from '$app/forms';

	let loading = false;
</script>

<h2 class="text-2xl font-bold mb-8">Setup NGINX</h2>
<p>Light-Whale needs to setup NGINX container and create internal docker network:</p>
<form
	method="POST"
	use:enhance={() => {
		loading = true;
		return ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<button class="btn btn-primary my-4 text-base" class:loading disabled={loading}
		>Setup NGINX</button
	>
</form>

<style lang="scss">
</style>
