<script lang="ts">
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import { status } from '$lib/client/stores/status';
</script>

<svelte:head>
	<title>Health Check - Light-Whale</title>
</svelte:head>

<div class="mx-0 mt-0 mb-8">
	<CheckCard
		status={$status.dockerRunning ? 'success' : 'error'}
		title="Docker daemon {$status.dockerRunning ? 'running' : 'not running'}"
		msg={$status.dockerRunning ? 'Docker daemon is running' : 'Docker daemon is not running'}
	/>

	<CheckCard
		status={$status.dockerPing ? 'success' : 'error'}
		title="{$status.dockerPing ? 'C' : 'Not c'}onnected"
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
