/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DistributionInspect } from '../models/DistributionInspect';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DistributionService {

    /**
     * Get image information from the registry
     * Return image digest and platform information by contacting the registry.
 * 
     * @param name Image name or id
     * @returns DistributionInspect descriptor and platform information
     * @throws ApiError
     */
    public static distributionInspect(
name: string,
): CancelablePromise<DistributionInspect> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/distribution/{name}/json',
            path: {
                'name': name,
            },
            errors: {
                401: `Failed authentication or no image found`,
                500: `Server error`,
            },
        });
    }

}
