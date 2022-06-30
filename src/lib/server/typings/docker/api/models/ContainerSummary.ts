/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EndpointSettings } from './EndpointSettings';
import type { MountPoint } from './MountPoint';
import type { Port } from './Port';

export type ContainerSummary = {
    /**
     * The ID of this container
     */
    Id?: string;
    /**
     * The names that this container has been given
     */
    Names?: Array<string>;
    /**
     * The name of the image used when creating this container
     */
    Image?: string;
    /**
     * The ID of the image that this container was created from
     */
    ImageID?: string;
    /**
     * Command to run when starting the container
     */
    Command?: string;
    /**
     * When the container was created
     */
    Created?: number;
    /**
     * The ports exposed by this container
     */
    Ports?: Array<Port>;
    /**
     * The size of files that have been created or changed by this container
     */
    SizeRw?: number;
    /**
     * The total size of all the files in this container
     */
    SizeRootFs?: number;
    /**
     * User-defined key/value metadata.
     */
    Labels?: Record<string, string>;
    /**
     * The state of this container (e.g. `Exited`)
     */
    State?: string;
    /**
     * Additional human-readable status of this container (e.g. `Exit 0`)
     */
    Status?: string;
    HostConfig?: {
NetworkMode?: string;
};
    /**
     * A summary of the container's network settings
     */
    NetworkSettings?: {
Networks?: Record<string, EndpointSettings>;
};
    Mounts?: Array<MountPoint>;
};
