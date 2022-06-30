/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OCIDescriptor } from './OCIDescriptor';
import type { OCIPlatform } from './OCIPlatform';

/**
 * Describes the result obtained from contacting the registry to retrieve
 * image metadata.
 * 
 */
export type DistributionInspect = {
    Descriptor: OCIDescriptor;
    /**
     * An array containing all platforms supported by the image.
 * 
     */
    Platforms: Array<OCIPlatform>;
};
