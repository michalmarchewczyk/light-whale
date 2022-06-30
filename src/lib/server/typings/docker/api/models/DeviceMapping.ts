/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A device mapping between the host and container
 */
export type DeviceMapping = {
    PathOnHost?: string;
    PathInContainer?: string;
    CgroupPermissions?: string;
};
