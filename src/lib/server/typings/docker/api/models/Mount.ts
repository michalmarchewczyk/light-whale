/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Mount = {
    /**
     * Container path.
     */
    Target?: string;
    /**
     * Mount source (e.g. a volume name, a host path).
     */
    Source?: string;
    /**
     * The mount type. Available types:
 *
 * - `bind` Mounts a file or directory from the host into the container. Must exist prior to creating the container.
 * - `volume` Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed.
 * - `tmpfs` Create a tmpfs with the given options. The mount source cannot be specified for tmpfs.
 * - `npipe` Mounts a named pipe from the host into the container. Must exist prior to creating the container.
 * 
     */
    Type?: Mount.Type;
    /**
     * Whether the mount should be read-only.
     */
    ReadOnly?: boolean;
    /**
     * The consistency requirement for the mount: `default`, `consistent`, `cached`, or `delegated`.
     */
    Consistency?: string;
    /**
     * Optional configuration for the `bind` type.
     */
    BindOptions?: {
/**
 * A propagation mode with the value `[r]private`, `[r]shared`, or `[r]slave`.
 */
Propagation?: Mount.Propagation;
/**
 * Disable recursive bind mount.
 */
NonRecursive?: boolean;
};
    /**
     * Optional configuration for the `volume` type.
     */
    VolumeOptions?: {
/**
 * Populate volume with data from the target.
 */
NoCopy?: boolean;
/**
 * User-defined key/value metadata.
 */
Labels?: Record<string, string>;
/**
 * Map of driver specific options
 */
DriverConfig?: {
/**
 * Name of the driver to use to create the volume.
 */
Name?: string;
/**
 * key/value map of driver specific options.
 */
Options?: Record<string, string>;
};
};
    /**
     * Optional configuration for the `tmpfs` type.
     */
    TmpfsOptions?: {
/**
 * The size for the tmpfs mount in bytes.
 */
SizeBytes?: number;
/**
 * The permission mode for the tmpfs mount in an integer.
 */
Mode?: number;
};
};

export namespace Mount {

    /**
     * The mount type. Available types:
 *
 * - `bind` Mounts a file or directory from the host into the container. Must exist prior to creating the container.
 * - `volume` Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed.
 * - `tmpfs` Create a tmpfs with the given options. The mount source cannot be specified for tmpfs.
 * - `npipe` Mounts a named pipe from the host into the container. Must exist prior to creating the container.
 * 
     */
    export enum Type {
        BIND = 'bind',
        VOLUME = 'volume',
        TMPFS = 'tmpfs',
        NPIPE = 'npipe',
    }

    /**
     * A propagation mode with the value `[r]private`, `[r]shared`, or `[r]slave`.
     */
    export enum Propagation {
        PRIVATE = 'private',
        RPRIVATE = 'rprivate',
        SHARED = 'shared',
        RSHARED = 'rshared',
        SLAVE = 'slave',
        RSLAVE = 'rslave',
    }


}
