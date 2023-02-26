export default interface DnsRecord {
	provider: string;
	id: string;
	name: string;
	type: string;
	content: string;
	ttl: number;
	modifiedDate: Date;
}
