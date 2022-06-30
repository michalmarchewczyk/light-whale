/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Service } from '../models/Service';
import type { ServiceSpec } from '../models/ServiceSpec';
import type { ServiceUpdateResponse } from '../models/ServiceUpdateResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceService {

    /**
     * List services
     * @param filters A JSON encoded value of the filters (a `map[string][]string`) to
 * process on the services list.
 *
 * Available filters:
 *
 * - `id=<service id>`
 * - `label=<service label>`
 * - `mode=["replicated"|"global"]`
 * - `name=<service name>`
 * 
     * @param status Include service status, with count of running and desired tasks.
 * 
     * @returns Service no error
     * @throws ApiError
     */
    public static serviceList(
filters?: string,
status?: boolean,
): CancelablePromise<Array<Service>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/services',
            query: {
                'filters': filters,
                'status': status,
            },
            errors: {
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Create a service
     * @param body 
     * @param xRegistryAuth A base64url-encoded auth configuration for pulling from private
 * registries.
 *
 * Refer to the [authentication section](#section/Authentication) for
 * details.
 * 
     * @returns any no error
     * @throws ApiError
     */
    public static serviceCreate(
body: ServiceSpec,
xRegistryAuth?: string,
): CancelablePromise<{
/**
 * The ID of the created service.
 */
ID?: string;
/**
 * Optional warning message
 */
Warning?: string;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/services/create',
            headers: {
                'X-Registry-Auth': xRegistryAuth,
            },
            body: body,
            errors: {
                400: `bad parameter`,
                403: `network is not eligible for services`,
                409: `name conflicts with an existing service`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Inspect a service
     * @param id ID or name of service.
     * @param insertDefaults Fill empty fields with default values.
     * @returns Service no error
     * @throws ApiError
     */
    public static serviceInspect(
id: string,
insertDefaults: boolean = false,
): CancelablePromise<Service> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/services/{id}',
            path: {
                'id': id,
            },
            query: {
                'insertDefaults': insertDefaults,
            },
            errors: {
                404: `no such service`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Delete a service
     * @param id ID or name of service.
     * @returns any no error
     * @throws ApiError
     */
    public static serviceDelete(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/services/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `no such service`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Update a service
     * @param id ID or name of service.
     * @param body 
     * @param version The version number of the service object being updated. This is
 * required to avoid conflicting writes.
 * This version number should be the value as currently set on the
 * service *before* the update. You can find the current version by
 * calling `GET /services/{id}`
 * 
     * @param registryAuthFrom If the `X-Registry-Auth` header is not specified, this parameter
 * indicates where to find registry authorization credentials.
 * 
     * @param rollback Set to this parameter to `previous` to cause a server-side rollback
 * to the previous service spec. The supplied spec will be ignored in
 * this case.
 * 
     * @param xRegistryAuth A base64url-encoded auth configuration for pulling from private
 * registries.
 *
 * Refer to the [authentication section](#section/Authentication) for
 * details.
 * 
     * @returns ServiceUpdateResponse no error
     * @throws ApiError
     */
    public static serviceUpdate(
id: string,
body: ServiceSpec,
version: number,
registryAuthFrom: 'spec' | 'previous-spec' = 'spec',
rollback?: string,
xRegistryAuth?: string,
): CancelablePromise<ServiceUpdateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/services/{id}/update',
            path: {
                'id': id,
            },
            headers: {
                'X-Registry-Auth': xRegistryAuth,
            },
            query: {
                'version': version,
                'registryAuthFrom': registryAuthFrom,
                'rollback': rollback,
            },
            body: body,
            errors: {
                400: `bad parameter`,
                404: `no such service`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Get service logs
     * Get `stdout` and `stderr` logs from a service. See also
 * [`/containers/{id}/logs`](#operation/ContainerLogs).
 *
 * **Note**: This endpoint works only for services with the `local`,
 * `json-file` or `journald` logging drivers.
 * 
     * @param id ID or name of the service
     * @param details Show service context and extra details provided to logs.
     * @param follow Keep connection after returning logs.
     * @param stdout Return logs from `stdout`
     * @param stderr Return logs from `stderr`
     * @param since Only return logs since this time, as a UNIX timestamp
     * @param timestamps Add timestamps to every log line
     * @param tail Only return this number of log lines from the end of the logs.
 * Specify as an integer or `all` to output all log lines.
 * 
     * @returns binary logs returned as a stream in response body
     * @throws ApiError
     */
    public static serviceLogs(
id: string,
details: boolean = false,
follow: boolean = false,
stdout: boolean = false,
stderr: boolean = false,
since?: number,
timestamps: boolean = false,
tail: string = 'all',
): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/services/{id}/logs',
            path: {
                'id': id,
            },
            query: {
                'details': details,
                'follow': follow,
                'stdout': stdout,
                'stderr': stderr,
                'since': since,
                'timestamps': timestamps,
                'tail': tail,
            },
            errors: {
                404: `no such service`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

}
