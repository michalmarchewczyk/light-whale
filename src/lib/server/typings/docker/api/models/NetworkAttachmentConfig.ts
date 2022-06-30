/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Specifies how a service should be attached to a particular network.
 * 
 */
export type NetworkAttachmentConfig = {
    /**
     * The target network for attachment. Must be a network name or ID.
 * 
     */
    Target?: string;
    /**
     * Discoverable alternate names for the service on this network.
 * 
     */
    Aliases?: Array<string>;
    /**
     * Driver attachment options for the network target.
 * 
     */
    DriverOpts?: Record<string, string>;
};
