<script lang="ts">
	export let label = '';
	export let name = '';
	export let remove;

	export let open = false;
</script>

<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open}>
<div class="modal">
	<div class="modal-box">
		<p>Do you really want to remove {label}
			<span class="font-bold">{name}</span> ?
		</p>
		<div class="modal-action">
			<button class="btn btn-primary" on:click={() => {
				open = false;
				remove();
			}}>
				Remove
			</button>
			<button class="btn" on:click={() => open = false}>Cancel</button>
		</div>
	</div>
</div>

<style lang="scss">

</style>
