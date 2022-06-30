import NginxChecker from '$lib/server/network/NginxChecker';
import NginxController from '$lib/server/network/NginxController';
import SitesManager from '$lib/server/network/SitesManager';

export const nginxChecker = new NginxChecker();

export const nginxController = new NginxController(nginxChecker);

export const sitesManager = new SitesManager(nginxController);
