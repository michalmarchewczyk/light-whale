import type DnsRecord from '$lib/server/dns/DnsRecord';

export default interface DnsZone {
	provider: string;
	id: string;
	name: string;
	records: DnsRecord[];
	modifiedDate: Date;
}
