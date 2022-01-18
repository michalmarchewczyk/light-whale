<script lang="ts">
	import {Site, sites} from '$lib/stores/sites';
	import {page} from '$app/stores';

	import GlobeAltIcon from '$icons/globe-alt.svg';
	import ClipboardCheckIcon from '$icons/clipboard-check.svg';

	let site:Site;

	$: site = $sites.find(s => s.domain === $page.params.id);
</script>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl pb-4">
	<div class="text-3xl font-bold pb-4 mx-8 pt-6">
		<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/sites">Sites / </a>
		{site?.domain}
		<div class="badge badge-lg float-right mt-1 text-lg h-8 border-none">
			Running
		</div>
	</div>
</div>
<div class="mx-4 sticky top-[5.75rem] z-50">
	<ul class="menu items-stretch px-6 shadow-lg bg-base-100 horizontal rounded-box w-full mt-0 z-30">
		<li class:bordered={$page.path === `/sites/${$page.params.id}`}>
			<a href="/sites/{$page.params.id}/">
				<GlobeAltIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				General
			</a>
		</li>
		<li class:bordered={$page.path === `/sites/${$page.params.id}/test`}>
			<a href="/sites/{$page.params.id}/test">
				<ClipboardCheckIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				Test
			</a>
		</li>
	</ul>
</div>

<div class="mx-4 mt-8 mb-8">
	<slot></slot>
</div>

<style lang="scss">

</style>
