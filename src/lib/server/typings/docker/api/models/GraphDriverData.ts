/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Information about the storage driver used to store the container's and
 * image's filesystem.
 * 
 */
export type GraphDriverData = {
    /**
     * Name of the storage driver.
     */
    Name: string;
    /**
     * Low-level storage metadata, provided as key/value pairs.
 *
 * This information is driver-specific, and depends on the storage-driver
 * in use, and should be used for informational purposes only.
 * 
     */
    Data: Record<string, string>;
};
