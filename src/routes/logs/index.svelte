<script lang="ts">
	import PageHeader from '$lib/components/page/PageHeader.svelte';
	import {onMount} from 'svelte';

	let loading = true;
	let logs = [];
	let logsFiltered = [];
	let scrollContainer;
	let selectInfo = true;
	let selectWarning = true;
	let selectError = true;
	let selectRouter = false;
	let selectClient = false;

	const getLogs = async () => {
		const res = await fetch('/logs/logs?skipLogger=true');
		if (res.status !== 200) return;
		logs = await res.json();
	};

	$: {
		logsFiltered = logs;
		if(!selectInfo){
			logsFiltered = logsFiltered.filter(log => log.type !== 'Info');
		}
		if(!selectWarning){
			logsFiltered = logsFiltered.filter(log => log.type !== 'Warning');
		}
		if(!selectError){
			logsFiltered = logsFiltered.filter(log => log.type !== 'Error');
		}
		if(!selectRouter){
			logsFiltered = logsFiltered.filter(log => log.type !== 'Router');
		}
		if(!selectClient){
			logsFiltered = logsFiltered.filter(log => log.type !== 'Client');
		}
	}

	$: {
		if (scrollContainer) {
			scrollContainer.scrollTop = logs.length * 100;
		}
	}



	onMount(() => {
		getLogs().then(() => {
			loading = false;
		});
		const interval = setInterval(getLogs, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:head>
	<title>Logs</title>
</svelte:head>

<div class="max-w-5xl mx-auto text-base-content">
	<PageHeader>
		Logs
	</PageHeader>
	<div class="mx-4 mt-0 mb-8">
		<div class="card shadow-lg bg-base-100 p-0 max-h-[calc(100vh-13rem)] overflow-hidden">
			<div class="mx-0 p-3 px-5 font-bold text-lg pb-3 border-b-2 mb-0">
				<span>Logs</span>
				<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
					<input type="checkbox" bind:checked="{selectClient}" class="checkbox checkbox-primary mt-0.5 float-left">
					<span class="label-text ml-2 text-base font-semibold float-left">Client</span>
				</label>
				<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
					<input type="checkbox" bind:checked="{selectRouter}" class="checkbox checkbox-primary mt-0.5 float-left">
					<span class="label-text ml-2 text-base font-semibold float-left">Router</span>
				</label>
				<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
					<input type="checkbox" bind:checked="{selectError}" class="checkbox checkbox-primary mt-0.5 float-left">
					<span class="label-text ml-2 text-base font-semibold float-left">Error</span>
				</label>
				<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
					<input type="checkbox" bind:checked="{selectWarning}" class="checkbox checkbox-primary mt-0.5 float-left">
					<span class="label-text ml-2 text-base font-semibold float-left">Warning</span>
				</label>
				<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
					<input type="checkbox" bind:checked="{selectInfo}" class="checkbox checkbox-primary mt-0.5 float-left">
					<span class="label-text ml-2 text-base font-semibold float-left">Info</span>
				</label>
			</div>
			{#if loading}
				<p class="p-6 text-xl text-center">Loading...</p>
			{:else}
				<div class="overflow-scroll whitespace-pre font-mono bg-base-100" bind:this={scrollContainer}>
					<div class="w-max">
						{#each logsFiltered as log, i}
							<p class="px-5 py-1 text-base w-full inline-block float-left clear-both text-base-content"
							   class:bg-base-200={i%2===0}>
								[{log.type}] {log.msg}
							</p>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">

</style>
