/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Config } from '../models/Config';
import type { ConfigSpec } from '../models/ConfigSpec';
import type { IdResponse } from '../models/IdResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConfigService {

    /**
     * List configs
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to
 * process on the configs list.
 *
 * Available filters:
 *
 * - `id=<config id>`
 * - `label=<key> or label=<key>=value`
 * - `name=<config name>`
 * - `names=<config name>`
 * 
     * @returns Config no error
     * @throws ApiError
     */
    public static configList(
filters?: string,
): CancelablePromise<Array<Config>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/configs',
            query: {
                'filters': filters,
            },
            errors: {
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Create a config
     * @param body 
     * @returns IdResponse no error
     * @throws ApiError
     */
    public static configCreate(
body?: ConfigSpec,
): CancelablePromise<IdResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/configs/create',
            body: body,
            errors: {
                409: `name conflicts with an existing object`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Inspect a config
     * @param id ID of the config
     * @returns Config no error
     * @throws ApiError
     */
    public static configInspect(
id: string,
): CancelablePromise<Config> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/configs/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `config not found`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Delete a config
     * @param id ID of the config
     * @returns void 
     * @throws ApiError
     */
    public static configDelete(
id: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/configs/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `config not found`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Update a Config
     * @param id The ID or name of the config
     * @param version The version number of the config object being updated. This is
 * required to avoid conflicting writes.
 * 
     * @param body The spec of the config to update. Currently, only the Labels field
 * can be updated. All other fields must remain unchanged from the
 * [ConfigInspect endpoint](#operation/ConfigInspect) response values.
 * 
     * @returns any no error
     * @throws ApiError
     */
    public static configUpdate(
id: string,
version: number,
body?: ConfigSpec,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/configs/{id}/update',
            path: {
                'id': id,
            },
            query: {
                'version': version,
            },
            body: body,
            errors: {
                400: `bad parameter`,
                404: `no such config`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

}
