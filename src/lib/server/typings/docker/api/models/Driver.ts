/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Driver represents a driver (network, logging, secrets).
 */
export type Driver = {
    /**
     * Name of the driver.
     */
    Name: string;
    /**
     * Key/value map of driver-specific options.
     */
    Options?: Record<string, string>;
};
