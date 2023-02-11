import StatusController from '$lib/server/status/StatusController';
import { dockerController } from '$lib/server/docker';

export const statusController = new StatusController(dockerController);
