<script lang="ts">
	import { theme, animations, hideLwContainer } from '$lib/client/stores/settings';
</script>

<svelte:head>
	<title>General Settings - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<span class="card-title mb-4">Appearance</span>
		<label class="flex align-middle items-center justify-between mb-4">
			<span class="text-lg w-40">Dark mode</span>
			<input
				type="checkbox"
				class="toggle mt-1"
				checked={$theme === 'default-dark'}
				on:change={() => {
					$theme = $theme === 'default-dark' ? 'default-light' : 'default-dark';
				}}
			/>
		</label>
		<label class="flex align-middle items-center justify-between">
			<span class="text-lg w-40 whitespace-nowrap">Disable animations</span>
			<input
				type="checkbox"
				class="toggle mt-1"
				checked={!$animations}
				on:change={() => {
					$animations = !$animations;
				}}
			/>
		</label>
	</div>
</div>
<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<label class="flex align-middle items-center justify-between">
			<span class="text-lg w-40  whitespace-nowrap">Hide LW Container</span>
			<input
				type="checkbox"
				class="toggle mt-1"
				checked={$hideLwContainer}
				on:change={() => {
					$hideLwContainer = !$hideLwContainer;
				}}
			/>
		</label>
	</div>
</div>

<style lang="scss">
</style>
