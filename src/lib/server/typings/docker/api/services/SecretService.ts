/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdResponse } from '../models/IdResponse';
import type { Secret } from '../models/Secret';
import type { SecretSpec } from '../models/SecretSpec';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SecretService {

    /**
     * List secrets
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to
 * process on the secrets list.
 *
 * Available filters:
 *
 * - `id=<secret id>`
 * - `label=<key> or label=<key>=value`
 * - `name=<secret name>`
 * - `names=<secret name>`
 * 
     * @returns Secret no error
     * @throws ApiError
     */
    public static secretList(
filters?: string,
): CancelablePromise<Array<Secret>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/secrets',
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
     * Create a secret
     * @param body 
     * @returns IdResponse no error
     * @throws ApiError
     */
    public static secretCreate(
body?: SecretSpec,
): CancelablePromise<IdResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/secrets/create',
            body: body,
            errors: {
                409: `name conflicts with an existing object`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Inspect a secret
     * @param id ID of the secret
     * @returns Secret no error
     * @throws ApiError
     */
    public static secretInspect(
id: string,
): CancelablePromise<Secret> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/secrets/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `secret not found`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Delete a secret
     * @param id ID of the secret
     * @returns void 
     * @throws ApiError
     */
    public static secretDelete(
id: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/secrets/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `secret not found`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Update a Secret
     * @param id The ID or name of the secret
     * @param version The version number of the secret object being updated. This is
 * required to avoid conflicting writes.
 * 
     * @param body The spec of the secret to update. Currently, only the Labels field
 * can be updated. All other fields must remain unchanged from the
 * [SecretInspect endpoint](#operation/SecretInspect) response values.
 * 
     * @returns any no error
     * @throws ApiError
     */
    public static secretUpdate(
id: string,
version: number,
body?: SecretSpec,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/secrets/{id}/update',
            path: {
                'id': id,
            },
            query: {
                'version': version,
            },
            body: body,
            errors: {
                400: `bad parameter`,
                404: `no such secret`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

}
