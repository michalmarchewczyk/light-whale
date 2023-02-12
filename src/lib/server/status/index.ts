import StatusController from '$lib/server/status/StatusController';
import { dockerController, nginxManager } from '$lib/server/docker';

export const statusController = new StatusController(dockerController, nginxManager);
