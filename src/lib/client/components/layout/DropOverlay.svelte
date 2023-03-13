<script lang="ts">
	import DownloadIcon from '$icons/arrow-down-tray.svg';
	import { goto } from '$app/navigation';

	export let dragging = false;
	let value = '';

	const drag = (e) => {
		const data = e.dataTransfer;
		const items = data.items;
		const item = items[0];
		if (item.kind === 'string') {
			value = 'Drop here';
		} else if (item.kind === 'file') {
			value = 'Drop file(s) here';
		} else {
			value = '';
		}
	};

	const drop = (e) => {
		const data = e.dataTransfer;
		const items = data.items;
		const item = items[0];
		if (item.kind === 'string') {
			item.getAsString((text) => {
				handleString(text);
			});
		}
		value = '';
	};

	const handleString = (text: string) => {
		if (text.includes('github.com/') || text.includes('gitlab.com/')) {
			if (text.includes(' ')) {
				text = text.split(' ')[0];
			}
			text = text + '.git';
		}
		if (text.endsWith('.git')) {
			goto('/sources/git?pull=' + decodeURIComponent(text));
		}
		if (text.includes('hub.docker.com/')) {
			const pathname = text.split('hub.docker.com/')[1];
			const data = new FormData();
			if (pathname.startsWith('r/')) {
				data.append('image', pathname.split('/')[1] + '/' + pathname.split('/')[2]);
			} else {
				data.append('image', pathname.split('/')[1]);
			}
			data.append('tag', 'latest');
			fetch('/images?/pull', {
				method: 'POST',
				body: data
			}).then(async (res) => {
				if (res.status === 200) {
					await goto('/processes');
				}
			});
		}
	};
</script>

<div
	class="fixed top-0 left-0 w-full h-full bg-base-300 bg-opacity-40 z-50 flex justify-center items-center"
	class:pointer-events-none={!dragging}
	class:hidden={!dragging}
	on:dragenter|preventDefault|stopPropagation={drag}
	on:dragover|preventDefault={() => ''}
	on:drop|preventDefault|stopPropagation={drop}
>
	<span class="text-7xl text-base-content opacity-60">
		<DownloadIcon class="w-48 h-48 mx-auto mb-8" />
		{value}
	</span>
</div>
