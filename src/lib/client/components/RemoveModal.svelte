<script lang="ts">
	export let label = '';
	export let name = '';
	export let remove;
	export let formaction: string | undefined = undefined;
	export let open = false;
</script>

<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open} />
<div class="modal z-[200]">
	<div class="modal-box">
		<p>
			Do you really want to remove {label}
			<span class="font-bold">{name}</span> ?
		</p>
		<div class="modal-action">
			<button
				class="btn btn-primary"
				on:click={() => {
					open = false;
					remove();
				}}
				{formaction}
			>
				Remove
			</button>
			<button class="btn" on:click={() => (open = false)} type="button">Cancel</button>
		</div>
	</div>
</div>
