import DnsProvidersController from '$lib/server/dns/DnsProvidersController';
import { tokensManager } from '$lib/server/auth';
import CloudflareProvider from '$lib/server/dns/providers/CloudflareProvider';
import IpSettingsController from '$lib/server/dns/IpSettingsController';
import { filesManager } from '$lib/server/utils/FilesManager';
import OvhProvider from '$lib/server/dns/providers/OvhProvider';

const cloudflareProvider = new CloudflareProvider(tokensManager);
const ovhProvider = new OvhProvider(tokensManager);

export const dnsProvidersController = new DnsProvidersController([cloudflareProvider, ovhProvider]);

export const ipSettingsController = new IpSettingsController(filesManager);
