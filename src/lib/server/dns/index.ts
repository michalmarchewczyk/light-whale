import DnsProvidersController from '$lib/server/dns/DnsProvidersController';
import { tokensManager } from '$lib/server/auth';
import CloudflareProvider from '$lib/server/dns/providers/CloudflareProvider';

const cloudflareProvider = new CloudflareProvider(tokensManager);

export const dnsProvidersController = new DnsProvidersController([cloudflareProvider]);
