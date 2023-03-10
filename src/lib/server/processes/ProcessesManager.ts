import type Process from '$lib/server/processes/Process';
import crypto from 'crypto';
import { eventsController } from '$lib/server/events/EventsController';

export default class ProcessesManager {
	private processes: Process[] = [];
	private controllers: Record<Process['id'], ReadableStreamDefaultController[]> = {};

	public async createNewProcess(title: string) {
		const process: Process = {
			id: crypto.randomBytes(16).toString('hex'),
			title,
			state: 'running',
			progress: -1,
			data: '',
			started: new Date(),
			lastUpdated: new Date()
		};
		this.processes.push(process);
		this.controllers[process.id] = [];
		eventsController.pushInfo('Process started', process.title);
		return process;
	}

	public async updateProcess(
		id: string,
		state: Process['state'],
		newData: string,
		progress?: number
	) {
		const process = this.processes.find((process) => process.id === id);
		if (!process) {
			throw new Error('Process not found');
		}
		process.state = state;
		process.data = process.data + newData;
		process.lastUpdated = new Date();
		process.progress = progress ?? process.progress;
		for (const controller of this.controllers[id]) {
			controller.enqueue(JSON.stringify({ state, progress: process.progress, newData }) + '\n');
		}
		if (process.state === 'done' || process.state === 'error') {
			eventsController.pushInfo('Process ended', process.title);
			for (const controller of this.controllers[id]) {
				controller.close();
			}
		}
	}

	public getProcesses(): Process[] {
		return this.processes;
	}

	public getReadableStream(id: string) {
		let savedController: ReadableStreamDefaultController;
		return new ReadableStream({
			start: (controller) => {
				savedController = controller;
				this.controllers[id].push(controller);
			},
			cancel: () => {
				this.controllers[id] = this.controllers[id].filter(
					(controller) => controller !== savedController
				);
			}
		});
	}
}
