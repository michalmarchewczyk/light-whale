<script lang="ts">
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import TrashIcon from '$icons/trash.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import {createEventDispatcher} from 'svelte';

	export let info;

	const dispatch = createEventDispatcher();

	let loading = false;

	const removePAT = async (id:string) => {
		loading = true;
		const res = await fetch('/api/auth/tokens', {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({id})
		});
		loading = false;
		if(res.status !== 200){
			return;
		}
		dispatch('refresh');
	};
</script>

<tr>
	<td class="flex items-center space-x-4">
		<div class="avatar rounded-md w-16 h-16">
			<img src="{info.avatarUrl}" alt="Avatar Tailwind CSS Component" class="rounded-md"/>
		</div>
		<div>
			<div class="text-lg font-bold">{info.name}</div>
			<div class="text-base opacity-50">{info.login}</div>
		</div>
	</td>
	<td class="w-80">
		<span class="w-80 {info.description ? '' : 'italic'} block mb-1 overflow-hidden overflow-ellipsis">
			{info.description.length ? decodeURIComponent(info.description) : 'no description'}
		</span>
		<ItemInfo class="w-48" icon={CalendarIcon}>{new Date(info.date).toLocaleString()}</ItemInfo>
	</td>
	<td>
		<ActionButton class="w-32 float-right" loading={loading} on:click={() => removePAT(info.id)} icon={TrashIcon}>
			Remove
		</ActionButton>
	</td>
</tr>

<style lang="scss">

</style>
