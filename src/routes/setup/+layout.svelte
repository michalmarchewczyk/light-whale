<script lang="ts">
	import Background from '$lib/client/assets/background.svg';
	import Logotype from '$lib/client/assets/logotype_white.png';
	import { page } from '$app/stores';
	let step = 1;

	$: {
		if ($page.route.id === '/setup/docker') step = 2;
		if ($page.route.id === '/setup/nginx') step = 3;
		if ($page.route.id === '/setup/dns') step = 4;
		if ($page.route.id === '/setup/github') step = 5;
		if ($page.route.id === '/setup/password') step = 6;
	}
</script>

<div class="fixed top-0 left-0 h-screen w-screen">
	<Background class="absolute top-0 left-0 h-5/6 w-auto" />
	<img src={Logotype} class="absolute h-16 w-auto top-8 left-8" alt="Light-Whale" />
</div>

<div class="flex absolute w-screen h-screen justify-center items-center p-8 z-10">
	<div class="card shadow-xl w-full max-w-5xl bg-base-100 mt-[-4rem]">
		<div class="card-body pt-5">
			<h1 class="card-title mb-8 text-2xl">Setup</h1>
			<ul class="steps steps-horizontal font-semibold text-base pt-1">
				<li class="step" class:step-primary={step >= 1} class:step-current={step === 1}>
					Install Light-Whale
				</li>
				<li class="step" class:step-primary={step >= 2} class:step-current={step === 2}>
					Install Docker
				</li>
				<li class="step" class:step-primary={step >= 3} class:step-current={step === 3}>
					Setup NGINX
				</li>
				<li class="step" class:step-primary={step >= 4} class:step-current={step === 4}>
					DNS (optional)
				</li>
				<li class="step" class:step-primary={step >= 5} class:step-current={step === 5}>
					Github (optional)
				</li>
				<li class="step" class:step-primary={step >= 6} class:step-current={step === 6}>
					Setup password
				</li>
			</ul>
			<div class="divider mb-0" />
			<div class="min-h-6 text-lg px-2 py-2">
				<slot />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.step-current::after {
		height: 2.6rem !important;
		width: 2.6rem !important;
		@apply text-lg font-bold;
	}
	.step-current {
		@apply font-bold;
	}
</style>
