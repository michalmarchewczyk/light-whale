import DnsProvidersController from '$lib/server/dns/DnsProvidersController';
import { tokensManager } from '$lib/server/auth';
import CloudflareProvider from '$lib/server/dns/providers/CloudflareProvider';
import IpSettingsController from '$lib/server/dns/IpSettingsController';
import { filesManager } from '$lib/server/utils/FilesManager';

const cloudflareProvider = new CloudflareProvider(tokensManager);

export const dnsProvidersController = new DnsProvidersController([cloudflareProvider]);

export const ipSettingsController = new IpSettingsController(filesManager);
