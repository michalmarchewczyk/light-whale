<script lang="ts">
	import {snackbars} from '$lib/stores/snackbars';
	import Snackbar from '$lib/components/layout/Snackbar.svelte';
</script>

<div class="fixed top-0 left-0 w-screen h-screen flex flex-col z-40 justify-end items-center px-4 pointer-events-none">
	{#each $snackbars as snackbar}
		<Snackbar snackbar={snackbar}/>
	{/each}
</div>

<style lang="scss">

</style>
