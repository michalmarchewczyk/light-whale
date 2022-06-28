<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	const dispatch = createEventDispatcher();

	let loading = false;

	const setupNginx = async () => {
		loading = true;
		const res = await fetch('/api/setup', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({stage: 'no-nginx',})
		});
		const status = await res.json();
		loading = false;
		dispatch('setupChange', status);
	};




</script>

<h2 class="text-2xl font-bold mb-8">Setup NGINX</h2>
<p>
	Light-Whale needs to setup NGINX container and create internal docker network:
</p>
<button class="btn btn-primary my-4 text-base" class:loading={loading} disabled="{loading}" on:click={setupNginx}>Setup NGINX</button>

