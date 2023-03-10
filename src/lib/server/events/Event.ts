export default interface Event {
	id: number;
	time: number;
	type: 'docker' | 'info' | 'success' | 'warning' | 'error';
	title: string;
	message: string;
}
