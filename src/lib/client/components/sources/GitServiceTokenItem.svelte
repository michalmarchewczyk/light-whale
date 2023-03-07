<script lang="ts">
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
	import TrashIcon from '$icons/trash.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import { enhance } from '$app/forms';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import GitIcon from '$lib/client/assets/icons/git.svg';
	import GithubIcon from '$lib/client/assets/icons/github.svg';
	import GitlabIcon from '$lib/client/assets/icons/gitlab.svg';
	import BitbucketIcon from '$lib/client/assets/icons/bitbucket.svg';

	export let token: GitServiceToken;

	let loading = false;

	let removeModal = false;
</script>

<tr>
	<td class="flex items-center space-x-4">
		<div class="avatar rounded-md w-16 h-16">
			{#if token.avatarUrl}
				<img src={token.avatarUrl} alt="" class="rounded-md" />
			{:else}
				<GitIcon class="w-full h-full opacity-50" />
			{/if}
		</div>
		<a class="hover:text-primary-focus" href={token.profileUrl} target="_blank" rel="noreferrer">
			<div class="text-lg font-bold">{token.name}</div>
			<div class="text-base opacity-50">{token.login}</div>
		</a>
	</td>
	<td class="w-80">
		<span
			class="w-80 {token.description ? '' : 'italic'} block mb-1 overflow-hidden overflow-ellipsis"
		>
			{token.description.length ? decodeURIComponent(token.description) : 'no description'}
		</span>
		<ItemInfo class="w-48" icon={CalendarIcon}>{new Date(token.date).toLocaleString()}</ItemInfo>
	</td>
	<td class="w-24">
		{#if token.service === 'github'}
			<GithubIcon class="w-20 h-8 ml-2" />
		{:else if token.service === 'gitlab'}
			<GitlabIcon class="w-24 h-8 mt-1" />
		{:else if token.service === 'bitbucket'}
			<BitbucketIcon class="w-24 h-8 mt-1" />
		{/if}
	</td>
	<td>
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
			<input type="hidden" name="id" value={token.id} />
			<ActionButton
				class="w-32 float-right"
				{loading}
				icon={TrashIcon}
				type="button"
				on:click={() => (removeModal = true)}>Remove</ActionButton
			>
			<RemoveModal
				bind:open={removeModal}
				formaction="/settings/git?/remove"
				name={token.login}
				label="{token.service} token for"
				confirmPassword="true"
				bind:loading
			>
				<input type="hidden" name="id" value={token.id} />
			</RemoveModal>
		</form>
	</td>
</tr>
