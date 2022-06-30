/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Node } from '../models/Node';
import type { NodeSpec } from '../models/NodeSpec';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NodeService {

    /**
     * List nodes
     * @param filters Filters to process on the nodes list, encoded as JSON (a `map[string][]string`).
 *
 * Available filters:
 * - `id=<node id>`
 * - `label=<engine label>`
 * - `membership=`(`accepted`|`pending`)`
 * - `name=<node name>`
 * - `node.label=<node label>`
 * - `role=`(`manager`|`worker`)`
 * 
     * @returns Node no error
     * @throws ApiError
     */
    public static nodeList(
filters?: string,
): CancelablePromise<Array<Node>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/nodes',
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
     * Inspect a node
     * @param id The ID or name of the node
     * @returns Node no error
     * @throws ApiError
     */
    public static nodeInspect(
id: string,
): CancelablePromise<Node> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/nodes/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `no such node`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Delete a node
     * @param id The ID or name of the node
     * @param force Force remove a node from the swarm
     * @returns any no error
     * @throws ApiError
     */
    public static nodeDelete(
id: string,
force: boolean = false,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/nodes/{id}',
            path: {
                'id': id,
            },
            query: {
                'force': force,
            },
            errors: {
                404: `no such node`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

    /**
     * Update a node
     * @param id The ID of the node
     * @param version The version number of the node object being updated. This is required
 * to avoid conflicting writes.
 * 
     * @param body 
     * @returns any no error
     * @throws ApiError
     */
    public static nodeUpdate(
id: string,
version: number,
body?: NodeSpec,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/nodes/{id}/update',
            path: {
                'id': id,
            },
            query: {
                'version': version,
            },
            body: body,
            errors: {
                400: `bad parameter`,
                404: `no such node`,
                500: `server error`,
                503: `node is not part of a swarm`,
            },
        });
    }

}
