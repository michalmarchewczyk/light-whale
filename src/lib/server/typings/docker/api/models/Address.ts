/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Address represents an IPv4 or IPv6 IP address.
 */
export type Address = {
    /**
     * IP address.
     */
    Addr?: string;
    /**
     * Mask length of the IP address.
     */
    PrefixLen?: number;
};
