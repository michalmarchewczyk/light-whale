<script context="module" lang="ts">
	import type {Load} from '@sveltejs/kit';

	const load:Load = async ({fetch}) => {
		const resDocker = await fetch('/api/setup/checkDocker');
		const docker = await resDocker.text();
		const resNginx = await fetch('/api/setup/checkNginx');
		const nginx = await resNginx.text();
		return {
			props: {
				docker,
				nginx,
			}
		};
	};

	export {
		load
	};
</script>

<script lang="ts">
	import FormPassword from '$lib/client/components/forms/FormPassword.svelte';
	import {goto} from '$app/navigation';
	import {page} from '$app/stores';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import {onMount} from 'svelte';

	export let docker;
	export let nginx;

	let step:number;
	let dockerAvailable = docker === 'ok';
	let nginxAvailable = nginx === 'ok';

	const fetchDockerAvailable = async ():Promise<void> => {
		const resDocker = await fetch('/api/setup/checkDocker?skipLogger=true');
		const docker = await resDocker.text();
		dockerAvailable = docker === 'ok';
	};

	const fetchNginxAvailable = async ():Promise<void> => {
		const resNginx = await fetch('/api/setup/checkNginx?skipLogger=true');
		const nginx = await resNginx.text();
		nginxAvailable = nginx === 'ok';
	};

	onMount(() => {
		const interval = setInterval(async () => {
			await fetchDockerAvailable();
			await fetchNginxAvailable();
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});

	$: {
		step = 4;
		if(!dockerAvailable){
			step = 2;
		}else if(!nginxAvailable){
			step = 3;
		}

	}

	let loading = false;

	const setupNginx = async () => {
		loading = true;
		const res = await fetch('/api/setup/setupNginx');
		const data = await res.text();
		if(data === 'ok'){
			step = 4;
		}
		loading = false;
	};

	let password = '';

	const setPassword = async () => {
		loading = true;
		const res = await fetch('/api/setup/setupPassword', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({password})
		});
		const data = await res.text();
		if(data === 'ok'){
			await goto('/login');
		}
		loading = false;
	};

</script>

<div class="card shadow-xl w-full max-w-5xl bg-base-100 mt-[-4rem]">
	<div class="card-body pt-5">
		<h1 class="card-title mb-8 text-2xl">Setup</h1>
		<ul class="steps steps-horizontal font-semibold text-base pt-1">
			<li class="step" class:step-primary={step >= 1} class:step-current={step === 1}>Install Light-Whale</li>
			<li class="step" class:step-primary={step >= 2} class:step-current={step === 2}>Install Docker</li>
			<li class="step" class:step-primary={step >= 3} class:step-current={step === 3}>Setup NGINX</li>
			<li class="step" class:step-primary={step >= 4} class:step-current={step === 4}>DNS (optional)</li>
			<li class="step" class:step-primary={step >= 5} class:step-current={step === 5}>Github (optional)</li>
			<li class="step" class:step-primary={step >= 6} class:step-current={step === 6}>Setup password</li>
		</ul>
		<div class="divider"></div>
		<div class="min-h-6 text-lg px-2 py-2">
			{#if step === 2}
				<h2 class="text-2xl font-bold mb-8">Install Docker Engine</h2>
				{#if $page.stuff?.system === 'Ubuntu'}
					<p>
						Let Light-Whale install Docker Engine for you ({$page.stuff?.system ?? '-'}):
					</p>
					<button class="btn btn-primary my-4 text-base">Install Docker</button>
					<p>
						or install Docker Engine yourself. <br/>
					</p>
				{/if}
				<p class="leading-10">
					In order to use Light-Whale you need to install
					<a href="https://www.docker.com/" class="link hover:text-primary-focus font-bold">Docker Engine</a>
					<br/>
					Make sure Docker Engine API is reachable at
					<span class="font-mono font-bold bg-base-300 text-base-content py-0.5 px-2 rounded-lg">http://localhost:2375</span>
				</p>
				<span class="inline-block font-semibold text-lg mt-4 mb-2">Current status:</span>
				{#if $page.stuff.docker === 'no-docker'}
					<CheckCard class="shadow-none mb-8 mx-[-1rem]" status="error" title="Docker not installed"
							   msg="You need to install and start Docker Engine"/>
				{/if}
				{#if $page.stuff.docker === 'no-ping'}
					<CheckCard class="shadow-none mb-8 mx-[-1rem]" status="error" title="Docker Engine API not reachable"
							   msg="Docker Engine is installed, but Docker Engine API is not reachable at http://localhost:2375"/>
				{/if}
				<div class="flex-row-reverse card-actions justify-between self-end bottom-0">
					<button class="btn btn-primary text-base" on:click={() => step += 1} disabled={!dockerAvailable}>Next</button>
				</div>
			{:else if step === 3}
				<h2 class="text-2xl font-bold mb-8">Setup NGINX</h2>
				<p>
					Light-Whale needs to setup NGINX container and create internal docker network:
				</p>
				<button class="btn btn-primary my-4 text-base" on:click={setupNginx}
						class:loading={loading} disabled="{loading}">Setup NGINX</button>
				<div class="flex-row-reverse card-actions justify-between self-end bottom-0">
					<button class="btn btn-primary text-base" on:click={() => step += 1} disabled={!nginxAvailable}>Next</button>
				</div>
			{:else if step === 4}
				<h2 class="text-2xl font-bold mb-8">Setup DNS Provider</h2>
				<p>
					Connect Light-Whale to your DNS Provider to more easily manage your domains.
				</p>
				<div class="flex-row-reverse card-actions justify-between self-end bottom-0">
					<div>
						<button class="btn btn-primary text-base" on:click={() => step += 1} disabled>Next</button>
					</div>
					<button class="btn btn-primary text-base" on:click={() => step += 1}>Skip</button>
				</div>
			{:else if step === 5}
				<h2 class="text-2xl font-bold mb-8">Setup Github account</h2>
				<p>
					You can connect your Github account in order to more easily create containers from your repositories.
				</p>
				<div class="flex-row-reverse card-actions justify-between self-end bottom-0">
					<div>
						<button class="btn btn-primary text-base" on:click={() => step += 1} disabled>Next</button>
					</div>
					<button class="btn btn-primary text-base" on:click={() => step += 1}>Skip</button>
				</div>
			{:else if step === 6}
				<h2 class="text-2xl font-bold mb-8">Setup password</h2>
				<p>
					Setup password for Light-Whale's panel:
				</p>
				<form on:submit|preventDefault={setPassword}>
					<FormPassword label="Password" placeholder="password" class="mt-4 mb-6" bind:value={password}/>
					<div class="flex-row-reverse card-actions justify-between self-end bottom-0">
						<input type="submit" class="btn btn-primary text-base" value="Save"/>
					</div>
				</form>
			{/if}

		</div>
	</div>
</div>

<style lang="scss">
	.step-current::after{
	  height: 2.6rem !important;
	  width: 2.6rem !important;
	  @apply text-lg font-bold;
	}
	.step-current {
	  @apply font-bold;
	}
</style>
