<script lang="ts">
	import SaveIcon from '$icons/save.svg';
	import {goto} from '$app/navigation';

	export let dragging = false;

	let value = '';

	const drag = (e) => {
		const data = e.dataTransfer;
		const items = data.items;
		const item = items[0];
		if(item.kind === 'string'){
			value = 'Drop here';
		}else if(item.kind === 'file'){
			value = 'Drop file(s) here';
		}else{
			value = '';
		}
	};

	const drop = (e) => {
		const data = e.dataTransfer;
		const items = data.items;
		const item = items[0];
		if(item.kind === 'string'){
			item.getAsString(text => {
				handleString(text);
			});
		}
		value = '';
	};

	const handleString = (text) => {
		if(text.includes('github.com/') || text.includes('gitlab.com/')){
			text = text + '.git';
		}
		if(text.endsWith('.git')){
			goto('/sources/git?pull='+decodeURIComponent(text));
		}
		// TODO: handle dockerhub links
	};
</script>

<div class="fixed top-0 left-0 w-full h-full bg-base-300 bg-opacity-40 z-50 flex justify-center items-center"
	 class:pointer-events-none={!dragging}
	 class:hidden={!dragging}
	 on:dragenter|preventDefault|stopPropagation={drag}
	 on:dragover|preventDefault={() => ''}
	 on:drop|preventDefault|stopPropagation={drop}>
	<span class="text-7xl text-base-content opacity-60">
		<SaveIcon class="w-48 h-48 mx-auto mb-8"/>
		{value}
	</span>
</div>

<style lang="scss">

</style>
