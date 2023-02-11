export default interface Event {
	id: number;
	time: number;
	type: 'docker' | 'info' | 'warning' | 'error';
	title: string;
	message: string;
}
