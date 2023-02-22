export default interface Process {
	id: string;
	title: string;
	state: 'running' | 'done' | 'error';
	progress: number;
	data: string;
	started: Date;
	lastUpdated: Date;
}
