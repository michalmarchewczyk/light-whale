/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EndpointIPAMConfig } from './EndpointIPAMConfig';

/**
 * Configuration for a network endpoint.
 */
export type EndpointSettings = {
    IPAMConfig?: EndpointIPAMConfig;
    Links?: Array<string>;
    Aliases?: Array<string>;
    /**
     * Unique ID of the network.
 * 
     */
    NetworkID?: string;
    /**
     * Unique ID for the service endpoint in a Sandbox.
 * 
     */
    EndpointID?: string;
    /**
     * Gateway address for this network.
 * 
     */
    Gateway?: string;
    /**
     * IPv4 address.
 * 
     */
    IPAddress?: string;
    /**
     * Mask length of the IPv4 address.
 * 
     */
    IPPrefixLen?: number;
    /**
     * IPv6 gateway address.
 * 
     */
    IPv6Gateway?: string;
    /**
     * Global IPv6 address.
 * 
     */
    GlobalIPv6Address?: string;
    /**
     * Mask length of the global IPv6 address.
 * 
     */
    GlobalIPv6PrefixLen?: number;
    /**
     * MAC address for the endpoint on this network.
 * 
     */
    MacAddress?: string;
    /**
     * DriverOpts is a mapping of driver options and values. These options
 * are passed directly to the driver and are driver specific.
 * 
     */
    DriverOpts?: Record<string, string> | null;
};
