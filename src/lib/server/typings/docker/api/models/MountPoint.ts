/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * MountPoint represents a mount point configuration inside the container.
 * This is used for reporting the mountpoints in use by a container.
 * 
 */
export type MountPoint = {
    /**
     * The mount type:
 *
 * - `bind` a mount of a file or directory from the host into the container.
 * - `volume` a docker volume with the given `Name`.
 * - `tmpfs` a `tmpfs`.
 * - `npipe` a named pipe from the host into the container.
 * 
     */
    Type?: MountPoint.Type;
    /**
     * Name is the name reference to the underlying data defined by `Source`
 * e.g., the volume name.
 * 
     */
    Name?: string;
    /**
     * Source location of the mount.
 *
 * For volumes, this contains the storage location of the volume (within
 * `/var/lib/docker/volumes/`). For bind-mounts, and `npipe`, this contains
 * the source (host) part of the bind-mount. For `tmpfs` mount points, this
 * field is empty.
 * 
     */
    Source?: string;
    /**
     * Destination is the path relative to the container root (`/`) where
 * the `Source` is mounted inside the container.
 * 
     */
    Destination?: string;
    /**
     * Driver is the volume driver used to create the volume (if it is a volume).
 * 
     */
    Driver?: string;
    /**
     * Mode is a comma separated list of options supplied by the user when
 * creating the bind/volume mount.
 *
 * The default is platform-specific (`"z"` on Linux, empty on Windows).
 * 
     */
    Mode?: string;
    /**
     * Whether the mount is mounted writable (read-write).
 * 
     */
    RW?: boolean;
    /**
     * Propagation describes how mounts are propagated from the host into the
 * mount point, and vice-versa. Refer to the [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
 * for details. This field is not used on Windows.
 * 
     */
    Propagation?: string;
};

export namespace MountPoint {

    /**
     * The mount type:
 *
 * - `bind` a mount of a file or directory from the host into the container.
 * - `volume` a docker volume with the given `Name`.
 * - `tmpfs` a `tmpfs`.
 * - `npipe` a named pipe from the host into the container.
 * 
     */
    export enum Type {
        BIND = 'bind',
        VOLUME = 'volume',
        TMPFS = 'tmpfs',
        NPIPE = 'npipe',
    }


}
