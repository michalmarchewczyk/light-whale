<script lang="ts">
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import CalendarIcon from '$icons/calendar.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import DownloadIcon from '$icons/download.svg';
	import CodeIcon from '$icons/code.svg';
	import UserIcon from '$icons/user.svg';
	import GithubIcon from '$lib/client/assets/icons/github.svg';

	export let repo;

	let loading = false;
	let name;
	let topLangSrc;
	let open = false;

	$: {
		name = decodeURIComponent(repo?.remoteName);
		if(name.startsWith('https://github.com/')){
			name = name.split('github.com/')[1];
		}
		if(name.endsWith('.git')){
			name = name.slice(0, -4);
		}
		topLangSrc = repo?.topLanguage?.toLowerCase() ?? '-';
	}
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-2 h-auto overflow-hidden">
	<div class="mx-1 sm:mx-2 w-16 {$$props.class}" class:text-success={false}>
		<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{topLangSrc}/{topLangSrc}-original.svg" alt=''
			 class="absolute w-10 h-10 sm:h-14 sm:w-14 mx-auto mt-1 stroke-[1.5px] bg-white p-1.5 rounded-md z-10" on:error={() => {
				if(!topLangSrc.endsWith('js')){
					topLangSrc = topLangSrc + 'js';
				}else{
					topLangSrc = 'git';
				}
			}}/>
		<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt=''
			 class="absolute w-10 h-10 sm:h-14 sm:w-14 mx-auto mt-1 stroke-[1.5px] bg-white p-1.5 rounded-md opacity-80 border-white border-2"/>
	</div>
	<a href="{repo.remoteName}" target="_blank" class="block w-48 flex-auto overflow-hidden mr-1 sm:mr-3 pr-1 sm:pr-4 hover:text-primary-focus">
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
			{name}
		</span>
		<ItemInfo icon={CodeIcon} class="mt-1">
			{repo.languages.join(', ')}
		</ItemInfo>
	</a>
	<div class="block w-36 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4 mt-1">
		<ItemInfo icon={UserIcon}>
			{repo.author}
		</ItemInfo>
		<ItemInfo icon={CalendarIcon} class="mb-0">
			{repo.lastDate}
		</ItemInfo>
	</div>
	<div class="block w-20 flex-0 overflow-hidden mr-2 sm:mr-6  flex items-middle">
		<GithubIcon class="w-20 my-auto"/>
	</div>
	<div class="block w-28 md:w-28 overflow-hidden flex-shrink-0 self-center">
		<ActionButton icon={DownloadIcon} loading={loading} class="w-28 h-8 md:h-12 md:w-28 md:mr-2"
		on:click={() => open = true}>
			Pull
		</ActionButton>
	</div>
</div>
