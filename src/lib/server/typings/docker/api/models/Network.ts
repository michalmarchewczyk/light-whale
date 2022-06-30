/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IPAM } from './IPAM';
import type { NetworkContainer } from './NetworkContainer';

export type Network = {
    Name?: string;
    Id?: string;
    Created?: string;
    Scope?: string;
    Driver?: string;
    EnableIPv6?: boolean;
    IPAM?: IPAM;
    Internal?: boolean;
    Attachable?: boolean;
    Ingress?: boolean;
    Containers?: Record<string, NetworkContainer>;
    Options?: Record<string, string>;
    Labels?: Record<string, string>;
};
