/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Describes the platform which the image in the manifest runs on, as defined
 * in the [OCI Image Index Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/image-index.md).
 * 
 */
export type OCIPlatform = {
    /**
     * The CPU architecture, for example `amd64` or `ppc64`.
 * 
     */
    architecture?: string;
    /**
     * The operating system, for example `linux` or `windows`.
 * 
     */
    os?: string;
    /**
     * Optional field specifying the operating system version, for example on
 * Windows `10.0.19041.1165`.
 * 
     */
    'os.version'?: string;
    /**
     * Optional field specifying an array of strings, each listing a required
 * OS feature (for example on Windows `win32k`).
 * 
     */
    'os.features'?: Array<string>;
    /**
     * Optional field specifying a variant of the CPU, for example `v7` to
 * specify ARMv7 when architecture is `arm`.
 * 
     */
    variant?: string;
};
