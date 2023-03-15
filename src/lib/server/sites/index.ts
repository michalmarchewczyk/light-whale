import { filesManager } from '$lib/server/utils/FilesManager';
import SitesManager from '$lib/server/sites/SitesManager';
import { dnsProvidersController, ipSettingsController } from '$lib/server/dns';
import { nginxManager } from '$lib/server/docker';
import AdminSitesManager from '$lib/server/sites/AdminSitesManager';

export const sitesManager = new SitesManager(
	filesManager,
	dnsProvidersController,
	ipSettingsController,
	nginxManager
);

export const adminSitesManager = new AdminSitesManager(sitesManager, nginxManager);
