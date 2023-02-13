export default interface ContainerData {
	id: string;
	name: string;
	imageName: string;
	imageId: string;
	command: string;
	created: Date;
	state: string;
	status: string;
	compose: string | null;
	networks: Record<string, unknown>;
}
