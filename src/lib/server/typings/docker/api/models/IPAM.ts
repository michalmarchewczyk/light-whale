/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IPAMConfig } from './IPAMConfig';

export type IPAM = {
    /**
     * Name of the IPAM driver to use.
     */
    Driver?: string;
    /**
     * List of IPAM configuration options, specified as a map:
 *
 * ```
 * {"Subnet": <CIDR>, "IPRange": <CIDR>, "Gateway": <IP address>, "AuxAddress": <device_name:IP address>}
 * ```
 * 
     */
    Config?: Array<IPAMConfig>;
    /**
     * Driver-specific options, specified as a map.
     */
    Options?: Record<string, string>;
};
