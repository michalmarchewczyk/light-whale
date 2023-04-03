<script lang="ts">
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import CalendarIcon from '$icons/calendar.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import SquaresPlusIcon from '$icons/squares-plus.svg';
	import CodeIcon from '$icons/code-bracket.svg';
	import UserIcon from '$icons/user.svg';
	import CommitIcon from '$lib/client/assets/icons/commit.svg';
	import CubeIcon from '$icons/cube.svg';
	import CubeTransparentIcon from '$icons/cube-transparent.svg';
	import type Repo from '$lib/server/sources/git/Repo';
	import RepoBuildModal from '$lib/client/components/sources/RepoBuildModal.svelte';

	export let repo: Repo;

	$: isComposeFile = repo?.dockerInfo.topFile?.includes('compose');

	let loading = false;
	let name;
	let topLangSrc;
	let open = false;
	$: {
		name = decodeURIComponent(repo?.gitInfo.remoteUrl ?? '');
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
		topLangSrc = repo?.languageInfo.topLanguage.toLowerCase();
	}
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-2 h-auto overflow-hidden">
	<div class="mx-1 sm:mx-2 w-20 {$$props.class}" class:text-success={false}>
		<img
			src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{topLangSrc}/{topLangSrc}-original.svg"
			alt=""
			class="absolute w-10 h-10 sm:h-16 sm:w-16 mx-auto mt-1 stroke-[1.5px] bg-transparent p-1.5 rounded-md z-10"
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
			class="absolute w-10 h-10 sm:h-16 sm:w-16 mx-auto mt-1 stroke-[1.5px] bg-white p-1.5 rounded-md opacity-80 border-white border-2"
		/>
	</div>
	<a
		href="/sources/git/{encodeURIComponent(repo.gitInfo.remoteUrl)}"
		class="block w-48 flex-auto overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus"
	>
		<span
			class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl"
		>
			{name}
		</span>
		<ItemInfo icon={CodeIcon} class="mt-1">
			{repo.languageInfo.languages.join(', ')}
		</ItemInfo>
		{#if repo.dockerInfo.topFile.length > 0}
			<ItemInfo icon={CubeIcon}>
				{repo.dockerInfo.topFile}
			</ItemInfo>
		{:else}
			<ItemInfo icon={CubeTransparentIcon} class="italic">not dockerized</ItemInfo>
		{/if}
	</a>
	<div class="block w-36 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={UserIcon}>
			{repo.gitInfo.owner}
		</ItemInfo>
		<ItemInfo icon={CommitIcon}>
			{repo.gitInfo.lastCommit}
		</ItemInfo>
		<ItemInfo icon={CalendarIcon} class="mb-0">
			{repo.gitInfo.lastCommitDate}
		</ItemInfo>
	</div>
	<div class="block w-28 md:w-28 overflow-hidden flex-shrink-0 self-center">
		<ActionButton
			icon={SquaresPlusIcon}
			{loading}
			class="w-28 h-8 md:h-12 md:w-28 md:mr-2"
			disabled={repo.dockerInfo.topFile.length === 0}
			on:click={() => (open = true)}
		>
			{isComposeFile ? 'Create' : 'Build'}
		</ActionButton>
		<RepoBuildModal bind:open {repo} />
		<!--		<ActionButton icon={DownloadIcon} {loading} class="w-28 h-8 md:h-10 md:w-28 md:mr-2 mt-2">-->
		<!--			Pull-->
		<!--		</ActionButton>-->
	</div>
</div>

<style lang="scss">
	img:not([src]) {
		visibility: hidden;
	}
</style>
