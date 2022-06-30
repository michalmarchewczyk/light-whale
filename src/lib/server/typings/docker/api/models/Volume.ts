/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Volume = {
    /**
     * Name of the volume.
     */
    Name: string;
    /**
     * Name of the volume driver used by the volume.
     */
    Driver: string;
    /**
     * Mount path of the volume on the host.
     */
    Mountpoint: string;
    /**
     * Date/Time the volume was created.
     */
    CreatedAt?: string;
    /**
     * Low-level details about the volume, provided by the volume driver.
 * Details are returned as a map with key/value pairs:
 * `{"key":"value","key2":"value2"}`.
 *
 * The `Status` field is optional, and is omitted if the volume driver
 * does not support this feature.
 * 
     */
    Status?: Record<string, any>;
    /**
     * User-defined key/value metadata.
     */
    Labels: Record<string, string>;
    /**
     * The level at which the volume exists. Either `global` for cluster-wide,
 * or `local` for machine level.
 * 
     */
    Scope: Volume.Scope;
    /**
     * The driver specific options used when creating the volume.
 * 
     */
    Options: Record<string, string>;
    /**
     * Usage details about the volume. This information is used by the
 * `GET /system/df` endpoint, and omitted in other endpoints.
 * 
     */
    UsageData?: {
/**
 * Amount of disk space used by the volume (in bytes). This information
 * is only available for volumes created with the `"local"` volume
 * driver. For volumes created with other volume drivers, this field
 * is set to `-1` ("not available")
 * 
 */
Size: number;
/**
 * The number of containers referencing this volume. This field
 * is set to `-1` if the reference-count is not available.
 * 
 */
RefCount: number;
} | null;
};

export namespace Volume {

    /**
     * The level at which the volume exists. Either `global` for cluster-wide,
 * or `local` for machine level.
 * 
     */
    export enum Scope {
        LOCAL = 'local',
        GLOBAL = 'global',
    }


}
