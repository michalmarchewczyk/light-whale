<script lang="ts">
	import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import DownloadIcon from '$icons/arrow-down-tray.svg';
	import CodeIcon from '$icons/code-bracket.svg';
	import UserIcon from '$icons/user.svg';
	import GithubIcon from '$lib/client/assets/icons/github.svg';
	import GitlabIcon from '$lib/client/assets/icons/gitlab.svg';
	import BitbucketIcon from '$lib/client/assets/icons/bitbucket.svg';
	import JetBrainsSpaceIcon from '$lib/client/assets/icons/space.svg';
	import EyeIcon from '$icons/eye.svg';
	import EyeOffIcon from '$icons/eye-slash.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import { enhance } from '$app/forms';

	export let repo: GitServiceRepo;
	let topLangSrc = '';
	let name;
	$: {
		name = decodeURIComponent(repo?.remoteUrl || '');
		if (name.startsWith('https://github.com/')) {
			name = name.split('github.com/')[1];
		}
		if (name.startsWith('https://gitlab.com/')) {
			name = name.split('gitlab.com/')[1];
		}
		if (name.includes('@bitbucket.org/')) {
			name = name.split('bitbucket.org/')[1];
		}
		if (name.startsWith('https://git.jetbrains.space/')) {
			name = name.split('https://git.jetbrains.space/')[1];
		}
		if (name.endsWith('.git')) {
			name = name.slice(0, -4);
		}
		topLangSrc = repo?.topLanguage?.toLowerCase() ?? '-';
	}

	let loading = false;
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-2 h-auto overflow-hidden">
	<div class="mx-1 sm:mx-2 w-16 {$$props.class}" class:text-success={false}>
		<img
			src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{topLangSrc}/{topLangSrc}-original.svg"
			alt=""
			class="absolute w-10 h-10 sm:h-14 sm:w-14 mx-auto mt-1 stroke-[1.5px] bg-white p-1.5 rounded-md z-10"
			on:error={() => {
				if (!topLangSrc.endsWith('js')) {
					topLangSrc = topLangSrc + 'js';
				} else {
					topLangSrc = 'git';
				}
			}}
		/>
		<img
			src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
			alt=""
			class="absolute w-10 h-10 sm:h-14 sm:w-14 mx-auto mt-1 stroke-[1.5px] bg-white p-1.5 rounded-md opacity-80 border-white border-2"
		/>
	</div>
	<a
		href={repo.remoteUrl}
		rel="noreferrer"
		target="_blank"
		class="block w-48 flex-auto overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	>
		<span
			class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl"
		>
			{name}
		</span>
		<ItemInfo icon={repo.visibility === 'public' ? EyeIcon : EyeOffIcon} class="mt-1 w-24">
			{repo.visibility}
		</ItemInfo>
		<ItemInfo icon={CodeIcon} class="mt-0 w-36">
			{repo.languages.join(', ') || 'unknown'}
		</ItemInfo>
	</a>
	<div class="block w-36 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={UserIcon}>
			{repo.owner}
		</ItemInfo>
		<ItemInfo icon={CalendarIcon} class="mb-0">
			{repo.lastCommitDate}
		</ItemInfo>
	</div>
	<div class="block w-24 flex-0 overflow-hidden mr-2 sm:mr-6  flex items-middle">
		{#if repo.service === 'github'}
			<GithubIcon class="w-20 my-auto ml-2" />
		{:else if repo.service === 'gitlab'}
			<GitlabIcon class="w-24 my-auto" />
		{:else if repo.service === 'bitbucket'}
			<BitbucketIcon class="w-24 my-auto" />
		{:else if repo.service === 'jetbrainsspace'}
			<JetBrainsSpaceIcon class="w-24 h-10 my-auto" />
		{/if}
	</div>
	<form
		class="block w-28 md:w-28 overflow-hidden flex-shrink-0 self-center"
		method="POST"
		use:enhance={() => {
			loading = true;
			return ({ update }) => {
				loading = false;
				update();
			};
		}}
		action="/sources/git?/pull"
	>
		<input type="hidden" name="remoteUrl" bind:value={repo.remoteUrl} />
		<ActionButton icon={DownloadIcon} {loading} class="w-28 h-8 md:h-12 md:w-28 md:mr-2">
			Pull
		</ActionButton>
	</form>
</div>

<style lang="scss">
	img:not([src]) {
		visibility: hidden;
	}
</style>
