export default interface Status {
	dockerRunning: boolean;
	dockerPing: boolean;
	lwNetwork: boolean;
	lwNginxContainer: {
		running: boolean;
		connected: boolean;
		ports: boolean;
		restartPolicy: boolean;
	};
}
