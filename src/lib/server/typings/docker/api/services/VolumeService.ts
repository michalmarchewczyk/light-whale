/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Volume } from '../models/Volume';
import type { VolumeCreateOptions } from '../models/VolumeCreateOptions';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VolumeService {

    /**
     * List volumes
     * @param filters JSON encoded value of the filters (a `map[string][]string`) to
 * process on the volumes list. Available filters:
 *
 * - `dangling=<boolean>` When set to `true` (or `1`), returns all
 * volumes that are not in use by a container. When set to `false`
 * (or `0`), only volumes that are in use by one or more
 * containers are returned.
 * - `driver=<volume-driver-name>` Matches volumes based on their driver.
 * - `label=<key>` or `label=<key>:<value>` Matches volumes based on
 * the presence of a `label` alone or a `label` and a value.
 * - `name=<volume-name>` Matches all or part of a volume name.
 * 
     * @returns any Summary volume data that matches the query
     * @throws ApiError
     */
    public static volumeList(
filters?: string,
): CancelablePromise<{
/**
 * List of volumes
 */
Volumes: Array<Volume>;
/**
 * Warnings that occurred when fetching the list of volumes.
 * 
 */
Warnings: Array<string>;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/volumes',
            query: {
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Create a volume
     * @param volumeConfig Volume configuration
     * @returns Volume The volume was created successfully
     * @throws ApiError
     */
    public static volumeCreate(
volumeConfig: VolumeCreateOptions,
): CancelablePromise<Volume> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/volumes/create',
            body: volumeConfig,
            errors: {
                500: `Server error`,
            },
        });
    }

    /**
     * Inspect a volume
     * @param name Volume name or ID
     * @returns Volume No error
     * @throws ApiError
     */
    public static volumeInspect(
name: string,
): CancelablePromise<Volume> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/volumes/{name}',
            path: {
                'name': name,
            },
            errors: {
                404: `No such volume`,
                500: `Server error`,
            },
        });
    }

    /**
     * Remove a volume
     * Instruct the driver to remove the volume.
     * @param name Volume name or ID
     * @param force Force the removal of the volume
     * @returns void 
     * @throws ApiError
     */
    public static volumeDelete(
name: string,
force: boolean = false,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/volumes/{name}',
            path: {
                'name': name,
            },
            query: {
                'force': force,
            },
            errors: {
                404: `No such volume or volume driver`,
                409: `Volume is in use and cannot be removed`,
                500: `Server error`,
            },
        });
    }

    /**
     * Delete unused volumes
     * @param filters Filters to process on the prune list, encoded as JSON (a `map[string][]string`).
 *
 * Available filters:
 * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune volumes with (or without, in case `label!=...` is used) the specified labels.
 * 
     * @returns any No error
     * @throws ApiError
     */
    public static volumePrune(
filters?: string,
): CancelablePromise<{
/**
 * Volumes that were deleted
 */
VolumesDeleted?: Array<string>;
/**
 * Disk space reclaimed in bytes
 */
SpaceReclaimed?: number;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/volumes/prune',
            query: {
                'filters': filters,
            },
            errors: {
                500: `Server error`,
            },
        });
    }

}
