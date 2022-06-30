/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterInfo } from './ClusterInfo';
import type { JoinTokens } from './JoinTokens';

export type Swarm = (ClusterInfo & {
JoinTokens?: JoinTokens;
});
