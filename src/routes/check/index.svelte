<script lang="ts">
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import {status} from '$lib/client/stores/status';

</script>

<svelte:head>
	<title>Health Check</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<PageHeader>
		Health Check
	</PageHeader>
	<div class="mx-4 mt-0 mb-8">
		<CheckCard status="{$status.dockerRunning ? 'success' : 'error'}"
				   title="Docker daemon {$status.dockerRunning  ? 'running' : 'not running'}"
				   msg="{$status.dockerRunning  ? 'Docker daemon is running' : 'Docker daemon is not running'}"/>

		<CheckCard status="{$status.dockerPinging ? 'success' : 'error'}"
				   title="{$status.dockerPinging ? 'C' : 'Not c'}onnected"
				   msg="{$status.dockerPinging ? 'Connected to Docker daemon' : 'Could not connect to Docker daemon'}"/>

		<CheckCard status="{$status.network ? 'success' : 'error'}"
				   title="Light-Whale's internal network is {$status.network ? 'working' : 'not working'}"
				   msg="{$status.network ? 'Internal network is working' : 'Could not find internal network'}"/>

		<CheckCard status="{$status.running ? 'success' : 'error'}"
				   title="Light-Whale's NGINX container is {$status.running ? 'running' : 'not running'}"
				   msg="{$status.running ? 'Container is running' : 'Container is not running'}"/>

		<CheckCard status="{$status.connected ? 'success' : 'error'}"
				   title="Light-Whale's NGINX container is {$status.connected ? 'connected' : 'not connected'} to internal network"
				   msg="{$status.connected ? 'Container is connected to internal network' : 'Container is not connected to internal network'}"/>

		<CheckCard status="{$status.ports ? 'success' : 'error'}"
				   title="Ports {$status.ports ? '' : 'not'} configured correctly"
				   msg="{$status.ports ? 'Light-Whale\'s NGINX container\' ports are configured correctly' : 'Ports bindings must be 80:80'}"/>

		<CheckCard status="{$status.ports ? 'success' : 'error'}"
				   title="Restart policy {$status.ports ? '' : 'not'} configured correctly"
				   msg="{$status.ports ? 'Light-Whale\'s NGINX container\' restart policy is configured correctly' : 'Container should restart automatically'}"/>
	</div>
</div>

<style lang="scss">

</style>
