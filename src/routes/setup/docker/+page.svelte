<script lang="ts">
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data: PageData;

	if (browser) {
		setInterval(() => {
			invalidate('setup:docker');
		}, 2000);
	}
</script>

<h2 class="text-2xl font-bold mb-8">Install Docker Engine</h2>
<!--{#if status.systemInfo.os === 'Ubuntu'}-->
<!--  <p>-->
<!--    Let Light-Whale install Docker Engine for you ({status.systemInfo.os ?? '-'}):-->
<!--  </p>-->
<!--  <button class="btn btn-primary my-4 text-base">Install Docker</button>-->
<!--  <p>-->
<!--    or install Docker Engine yourself. <br/>-->
<!--  </p>-->
<!--{:else}-->
<p class="leading-10">
	In order to use Light-Whale you need to install
	<a href="https://www.docker.com/" class="link hover:text-primary-focus font-bold">Docker Engine</a
	>
</p>
<!--{/if}-->
<br />
<p>
	Make sure Docker Engine API is reachable at
	<span class="font-mono font-bold bg-base-300 text-base-content py-0.5 px-2 rounded-lg"
		>http://localhost:2375</span
	>
</p>

<span class="inline-block font-semibold text-lg mt-8 mb-2">Current status:</span>
{#if data.dockerRunning === false}
	<CheckCard
		class="shadow-none mb-4 mx-[-1rem]"
		status="error"
		title="Docker not installed"
		msg="You need to install and start Docker Engine"
	/>
{:else if data.dockerPing === false}
	<CheckCard
		class="shadow-none mb-4 mx-[-1rem]"
		status="error"
		title="Docker Engine API not reachable"
		msg="Docker Engine is installed, but Docker Engine API is not reachable at http://localhost:2375"
	/>
{/if}

<style lang="scss">
</style>
