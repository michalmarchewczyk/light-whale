import StatusChecker from '$lib/server/check/StatusChecker';
import {nginxChecker} from '$lib/server/network';

export const statusChecker = new StatusChecker(nginxChecker);
