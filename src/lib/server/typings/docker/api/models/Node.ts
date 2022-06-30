/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ManagerStatus } from './ManagerStatus';
import type { NodeDescription } from './NodeDescription';
import type { NodeSpec } from './NodeSpec';
import type { NodeStatus } from './NodeStatus';
import type { ObjectVersion } from './ObjectVersion';

export type Node = {
    ID?: string;
    Version?: ObjectVersion;
    /**
     * Date and time at which the node was added to the swarm in
 * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
 * 
     */
    CreatedAt?: string;
    /**
     * Date and time at which the node was last updated in
 * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
 * 
     */
    UpdatedAt?: string;
    Spec?: NodeSpec;
    Description?: NodeDescription;
    Status?: NodeStatus;
    ManagerStatus?: ManagerStatus;
};
