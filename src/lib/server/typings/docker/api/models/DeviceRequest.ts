/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A request for devices to be sent to device drivers
 */
export type DeviceRequest = {
    Driver?: string;
    Count?: number;
    DeviceIDs?: Array<string>;
    /**
     * A list of capabilities; an OR list of AND lists of capabilities.
 * 
     */
    Capabilities?: Array<Array<string>>;
    /**
     * Driver-specific options, specified as a key/value pairs. These options
 * are passed directly to the driver.
 * 
     */
    Options?: Record<string, string>;
};
