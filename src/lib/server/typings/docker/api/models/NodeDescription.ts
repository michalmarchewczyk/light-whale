/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EngineDescription } from './EngineDescription';
import type { Platform } from './Platform';
import type { ResourceObject } from './ResourceObject';
import type { TLSInfo } from './TLSInfo';

/**
 * NodeDescription encapsulates the properties of the Node as reported by the
 * agent.
 * 
 */
export type NodeDescription = {
    Hostname?: string;
    Platform?: Platform;
    Resources?: ResourceObject;
    Engine?: EngineDescription;
    TLSInfo?: TLSInfo;
};
