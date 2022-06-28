<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	const dispatch = createEventDispatcher();

	const nextPage = () => {
		dispatch('nextPage');
	};
</script>

<h2 class="text-2xl font-bold mb-8">Setup Github account</h2>
<p>
	You can connect your Github account in order to more easily create containers from your repositories.
	<br/>
	You can always do that later in settings.
</p>
<div class="flex-row-reverse card-actions justify-between self-end bottom-0">
	<div>
		<button class="btn btn-primary text-base" on:click={nextPage} disabled>Next</button>
	</div>
	<button class="btn btn-primary text-base" on:click={nextPage}>Skip</button>
</div>
