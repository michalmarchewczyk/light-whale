<script lang="ts">
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import { status } from '$lib/client/stores/status';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import WrenchScrewdriverIcon from '$icons/wrench-screwdriver.svg';
	import { enhance } from '$app/forms';

	$: fixableErrors =
		$status?.dockerPing &&
		(!$status.lwNetwork ||
			!$status.lwNginxContainer.running ||
			!$status.lwNginxContainer.connected ||
			!$status.lwNginxContainer.ports ||
			!$status.lwNginxContainer.restartPolicy);

	let loading = false;
</script>

<svelte:head>
	<title>Health Check - Light-Whale</title>
</svelte:head>

<div class="mx-0 mt-0 mb-8">
	{#if fixableErrors}
		<form
			class="card shadow-md bg-base-100 mb-6"
			action="?/fix"
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					update();
					loading = false;
				};
			}}
		>
			<div class="card-body p-6 py-4 pl-5 flex flex-row justify-between items-center">
				<div>
					<h2 class="card-title text-xl mb-1">Fix errors</h2>
					<p>Light-Whale can try to automatically fix detected errors.</p>
				</div>
				<ActionButton class="w-20" icon={WrenchScrewdriverIcon} {loading}>Fix</ActionButton>
			</div>
		</form>
	{/if}
	<CheckCard
		status={$status.dockerRunning ? 'success' : 'error'}
		title="Docker daemon {$status.dockerRunning ? 'running' : 'not running'}"
		msg={$status.dockerRunning ? 'Docker daemon is running' : 'Docker daemon is not running'}
	/>

	<CheckCard
		status={$status.dockerPing ? 'success' : 'error'}
		title={$status.dockerPing ? 'Connected' : 'Not connected'}
		msg={$status.dockerPing ? 'Connected to Docker daemon' : 'Could not connect to Docker daemon'}
	/>

	<CheckCard
		status={$status.lwNetwork ? 'success' : 'error'}
		title="Light-Whale's internal network is {$status.lwNetwork ? 'working' : 'not working'}"
		msg={$status.lwNetwork ? 'Internal network is working' : 'Could not find internal network'}
	/>

	<CheckCard
		status={$status.lwNginxContainer.running ? 'success' : 'error'}
		title="Light-Whale's NGINX container is {$status.lwNginxContainer.running
			? 'running'
			: 'not running'}"
		msg={$status.lwNginxContainer.running ? 'Container is running' : 'Container is not running'}
	/>

	<CheckCard
		status={$status.lwNginxContainer.connected ? 'success' : 'error'}
		title="Light-Whale's NGINX container is {$status.lwNginxContainer.connected
			? 'connected'
			: 'not connected'} to internal network"
		msg={$status.lwNginxContainer.connected
			? 'Container is connected to internal network'
			: 'Container is not connected to internal network'}
	/>

	<CheckCard
		status={$status.lwNginxContainer.ports ? 'success' : 'error'}
		title="Ports {$status.lwNginxContainer.ports ? '' : 'not'} configured correctly"
		msg={$status.lwNginxContainer.ports
			? "Light-Whale's NGINX container's ports are configured correctly"
			: 'Ports bindings must be 80:80'}
	/>

	<CheckCard
		status={$status.lwNginxContainer.restartPolicy ? 'success' : 'error'}
		title="Restart policy {$status.lwNginxContainer.restartPolicy
			? ''
			: 'not'} configured correctly"
		msg={$status.lwNginxContainer.restartPolicy
			? "Light-Whale's NGINX container's restart policy is configured correctly"
			: 'Container should restart automatically'}
	/>
</div>

<style lang="scss">
</style>
