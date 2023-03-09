<script lang="ts">
	import FormPassword from '$lib/client/components/forms/FormPassword.svelte';
	import Portal from '$lib/client/components/Portal.svelte';
	import { enhance } from '$app/forms';

	export let label = '';
	export let name = '';
	export let remove = () => null;
	export let formaction: string | undefined = undefined;
	export let open = false;
	export let confirmPassword = false;
	export let loading = false;

	let password = '';
</script>

<Portal>
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open} />
		<div class="modal z-[200]">
			<div class="modal-box">
				<p>
					Do you really want to remove {label}
					<span class="font-bold">{name}</span> ?
					{#if confirmPassword}
						<FormPassword
							name="password"
							label="Confirm password"
							class="mt-4"
							bind:value={password}
						/>
					{/if}
					<slot />
				</p>
				<div class="modal-action">
					<button class="btn" on:click={() => (open = false)} type="button">Cancel</button>
					<button
						class="btn btn-primary"
						on:click={() => {
							open = false;
							remove();
						}}
						{formaction}
						disabled={confirmPassword && !password}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	</form>
</Portal>
