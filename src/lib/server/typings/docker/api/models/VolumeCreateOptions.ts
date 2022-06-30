/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Volume configuration
 */
export type VolumeCreateOptions = {
    /**
     * The new volume's name. If not specified, Docker generates a name.
 * 
     */
    Name?: string;
    /**
     * Name of the volume driver to use.
     */
    Driver?: string;
    /**
     * A mapping of driver options and values. These options are
 * passed directly to the driver and are driver specific.
 * 
     */
    DriverOpts?: Record<string, string>;
    /**
     * User-defined key/value metadata.
     */
    Labels?: Record<string, string>;
};
