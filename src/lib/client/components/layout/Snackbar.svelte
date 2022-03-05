<script lang="ts">
	import type {Snackbar} from '$lib/client/stores/snackbars';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let snackbar:Snackbar;
</script>

{#if snackbar.visible}
	<div class="w-80 h-12 text-primary-content mb-4 rounded-xl text-lg px-4 py-2 font-semibold shadow-xl z-10"
		 transition:fly="{{delay: 0, duration: 300, x: -100, y: 0, opacity: 0, easing: quintOut}}"
		 class:bg-info={snackbar.type === 'INFO'}
		 class:bg-success={snackbar.type === 'SUCCESS'}
		 class:bg-warning={snackbar.type === 'WARNING'}
		 class:bg-error={snackbar.type === 'ERROR'}
	>
		{snackbar.msg}
	</div>
{/if}

<style lang="scss">

</style>
