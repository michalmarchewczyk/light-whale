import { filesManager } from '$lib/server/utils/FilesManager';
import SitesManager from '$lib/server/sites/SitesManager';
import { dnsProvidersController, ipSettingsController } from '$lib/server/dns';
import { nginxManager } from '$lib/server/docker';

export const sitesManager = new SitesManager(
	filesManager,
	dnsProvidersController,
	ipSettingsController,
	nginxManager
);
