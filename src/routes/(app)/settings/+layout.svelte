<script>
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import PageMenu from '$lib/client/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/client/components/page/PageMenuItem.svelte';
	import GitIcon from '$lib/client/assets/icons/git.svg';
	import CogIcon from '$icons/cog-6-tooth.svg';
	import CheckCircleIcon from '$icons/check-circle.svg';
	import ListBulletIcon from '$icons/list-bullet.svg';
	import GlobeIcon from '$icons/globe-europe-africa.svg';
</script>

<div class="max-w-5xl mx-auto text-base-content">
	<PageHeader>Settings</PageHeader>
	<PageMenu>
		<PageMenuItem path="/settings" icon={CogIcon}>General</PageMenuItem>
		<PageMenuItem path="/settings/git" icon={GitIcon}>Git</PageMenuItem>
		<PageMenuItem path="/settings/dns" icon={GlobeIcon}>DNS</PageMenuItem>
		<PageMenuItem path="/settings/check" icon={CheckCircleIcon}>Health check</PageMenuItem>
		<PageMenuItem path="/settings/logs" icon={ListBulletIcon}>Logs</PageMenuItem>
	</PageMenu>

	<div class="mx-4 mt-8 mb-8">
		<slot />
	</div>
</div>
