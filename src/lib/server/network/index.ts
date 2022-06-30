import NginxChecker from '$lib/server/network/NginxChecker';
import NginxController from '$lib/server/network/NginxController';

export const nginxChecker = new NginxChecker();

export const nginxController = new NginxController(nginxChecker);
