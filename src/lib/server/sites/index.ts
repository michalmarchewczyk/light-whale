import { filesManager } from '$lib/server/utils/FilesManager';
import SitesManager from '$lib/server/sites/SitesManager';

export const sitesManager = new SitesManager(filesManager);
