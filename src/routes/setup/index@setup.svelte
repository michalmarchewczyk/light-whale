<script lang="ts">
	import {onMount} from 'svelte';
	import SetupDNS from '$lib/client/components/setup/SetupDNS.svelte';
	import SetupDocker from '$lib/client/components/setup/SetupDocker.svelte';
	import SetupNginx from '$lib/client/components/setup/SetupNginx.svelte';
	import SetupPassword from '$lib/client/components/setup/SetupPassword.svelte';
	import SetupGithub from '$lib/client/components/setup/SetupGithub.svelte';

	let status;
	let step:number;

	const checkStatus = async () => {
		const res = await fetch('/api/setup');
		status = await res.json();
		if(status.stage === 'no-docker'){
			step = 2;
		}else if(status.stage === 'no-nginx'){
			step = 3;
		}else if(status.stage === 'no-password'){
			if(!(step > 3)){
				step = 4;
			}
		}
	};

	onMount(() => {
		checkStatus();
		const interval = setInterval(() => {
			checkStatus();
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});

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
				<SetupDocker status={status}/>
			{:else if step === 3}
				<SetupNginx status={status} on:statusChange={(s) => status = s}/>
			{:else if step === 4}
				<SetupDNS status={status} on:nextPage={() => step += 1}/>
			{:else if step === 5}
				<SetupGithub status={status} on:nextPage={() => step += 1}/>
			{:else if step === 6}
				<SetupPassword status={status} on:statusChange={(s) => status = s}/>
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
