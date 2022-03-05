<script lang="ts">
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import {dockerAvailable} from '$lib/client/stores/docker';
	import {networkAvailable, nginxAvailable, nginxConfig, nginxConnected} from '$lib/client/stores/network';

</script>

<svelte:head>
	<title>Health Check</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<PageHeader>
		Health Check
	</PageHeader>
	<div class="mx-4 mt-0 mb-8">
		<CheckCard status="{$dockerAvailable ? 'success' : 'error'}"
				   title="Docker daemon is {$dockerAvailable ? 'running' : 'not running'}"
				   msg="{$dockerAvailable ? 'Connected to Docker daemon' : 'Could not connect to Docker daemon'}"/>

		<CheckCard status="{$networkAvailable ? 'success' : 'error'}"
				   title="Light-Whale's internal network is {$networkAvailable ? 'working' : 'not working'}"
				   msg="{$networkAvailable ? 'Internal network is working' : 'Could not find internal network'}"/>

		<CheckCard status="{$nginxAvailable ? 'success' : 'error'}"
				   title="Light-Whale's NGINX container is {$nginxAvailable ? 'running' : 'not running'}"
				   msg="{$nginxAvailable ? 'Container is running' : 'Container is not running'}"/>

		<CheckCard status="{$nginxConnected ? 'success' : 'error'}"
				   title="Light-Whale's NGINX container is {$nginxConnected ? 'connected' : 'not connected'} to internal network"
				   msg="{$nginxConnected ? 'Container is connected to internal network' : 'Container is not connected to internal network'}"/>

		<CheckCard status="{$nginxConfig === 'ok' ? 'success' : $nginxConfig === 'ports' ? 'error' : 'warning'}"
				   title="Light-Whale's NGINX container {$nginxConfig === 'ok' ? 'is configured correctly' :
			$nginxConfig === 'ports' ? 'doesn\'t have proper port bindings' : 'doesn\'t restart automatically'}"
				   msg="{$nginxConfig === 'ok' ? 'Ports bindings and restart policy are set correctly' :
			$nginxConfig === 'ports' ? 'Ports bindings must be 80:80' : 'Container should restart automatically'}"/>
	</div>
</div>

<style lang="scss">

</style>
