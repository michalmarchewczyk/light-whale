<script lang="ts">
	import { theme, animations } from '$lib/client/stores/settings';
</script>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<label class="flex align-middle items-center justify-between">
			<span class="text-xl w-40 font-semibold">Dark mode</span>
			<input
				type="checkbox"
				class="toggle mt-1"
				checked={$theme === 'default-dark'}
				on:change={() => {
					$theme = $theme === 'default-dark' ? 'default-light' : 'default-dark';
				}}
			/>
		</label>
	</div>
</div>
<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<label class="flex align-middle items-center justify-between">
			<span class="text-xl w-40 font-semibold whitespace-nowrap">Disable animations</span>
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

<style lang="scss">
</style>
