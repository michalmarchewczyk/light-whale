import type FilesManager from '$lib/server/utils/FilesManager';
import { logger } from '$lib/server/utils/Logger';
import type IpSettings from '$lib/server/dns/IpSettings';
import { eventsController } from '$lib/server/events/EventsController';

export default class IpSettingsController {
	private ipSettings: IpSettings = { v4addresses: [], v6addresses: [], autoAdd: true };

	constructor(private filesManager: FilesManager) {
		this.loadIpSettings().then(() => {
			logger.logVerbose('IpSettingsController initialized');
		});
	}

	private async loadIpSettings() {
		const settings = await this.filesManager.readFile('ip_settings.json');
		if (settings) {
			this.ipSettings = JSON.parse(settings);
		} else {
			await this.saveIpSettings();
		}
	}

	private async saveIpSettings(): Promise<void> {
		await this.filesManager.writeFile('ip_settings.json', JSON.stringify(this.ipSettings), true);
	}

	public async detectPublicIp() {
		logger.logVerbose('Detecting public IP');
		const res = await fetch('https://api64.ipify.org');
		if (res.status !== 200) {
			return null;
		}
		return await res.text();
	}

	public async addIp(ip: string) {
		if (this.ipSettings.v4addresses.includes(ip) || this.ipSettings.v6addresses.includes(ip)) {
			return false;
		}
		if (ip.includes(':')) {
			this.ipSettings.v6addresses.push(ip);
		} else {
			this.ipSettings.v4addresses.push(ip);
		}
		await this.saveIpSettings();
		eventsController.pushSuccess(
			'New IP address added',
			`IP address ${ip} has been added to the list of saved IPs`
		);
		return true;
	}

	public async removeIp(ip: string) {
		if (this.ipSettings.v4addresses.includes(ip)) {
			this.ipSettings.v4addresses = this.ipSettings.v4addresses.filter((i) => i !== ip);
		} else if (this.ipSettings.v6addresses.includes(ip)) {
			this.ipSettings.v6addresses = this.ipSettings.v6addresses.filter((i) => i !== ip);
		} else {
			return false;
		}
		await this.saveIpSettings();
		eventsController.pushSuccess(
			'IP address removed',
			`IP address ${ip} has been removed from the list of saved IPs`
		);
		return true;
	}

	public listV4Addresses() {
		return this.ipSettings.v4addresses;
	}

	public listV6Addresses() {
		return this.ipSettings.v6addresses;
	}

	public isAutoAdd() {
		return this.ipSettings.autoAdd;
	}

	public async updateSettings(settings: Pick<IpSettings, 'autoAdd'>) {
		this.ipSettings.autoAdd = settings.autoAdd;
		await this.saveIpSettings();
	}
}
