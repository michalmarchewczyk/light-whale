<script lang="ts">
	export let label = '';
	export let placeholder = '';
	export let value = '';
	export let name = '';
</script>

<div class="form-control mb-2 {$$props.class}" on:input>
	<label>
		<span class="label pl-0">
			<span class="label-text text-lg mb-0">{label}: </span>
		</span>
		<input
			bind:value
			{placeholder}
			{name}
			type="text"
			class="input input-bordered w-full text-base"
		/>
	</label>
</div>
