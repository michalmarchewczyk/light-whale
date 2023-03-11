<script lang="ts">
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import PageMenu from '$lib/client/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/client/components/page/PageMenuItem.svelte';
	import GitIcon from '$lib/client/assets/icons/git.svg';
	import FolderIcon from '$icons/folder.svg';
	import CommitIcon from '$lib/client/assets/icons/commit.svg';
	import { page } from '$app/stores';

	let name = decodeURIComponent($page.params.repo_url);
	if (name.startsWith('https://github.com/')) {
		name = name.split('github.com/')[1];
	}
	if (name.startsWith('https://gitlab.com/')) {
		name = name.split('gitlab.com/')[1];
	}
	if (name.includes('@bitbucket.org/')) {
		name = name.split('bitbucket.org/')[1];
	}
	if (name.endsWith('.git')) {
		name = name.slice(0, -4);
	}
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<PageHeader badge="">
		<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/sources/git">
			Sources / Git /
		</a>
		{name}
	</PageHeader>
	<PageMenu>
		<PageMenuItem path="/sources/git/{encodeURIComponent($page.params.repo_url)}" icon={GitIcon}
			>General</PageMenuItem
		>
		<PageMenuItem
			path="/sources/git/{encodeURIComponent($page.params.repo_url)}/commits"
			icon={CommitIcon}
		>
			Commits
		</PageMenuItem>
		<PageMenuItem
			path="/sources/git/{encodeURIComponent($page.params.repo_url)}/files"
			icon={FolderIcon}
		>
			Files
		</PageMenuItem>
	</PageMenu>

	<div class="mx-4 mt-8 mb-8">
		<slot />
	</div>
</div>
