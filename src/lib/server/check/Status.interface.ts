export interface Status {
	dockerRunning: boolean;
	dockerPinging: boolean;
	network: boolean;
	running: boolean;
	connected: boolean;
	ports: boolean;
	restartPolicy: boolean;
}
