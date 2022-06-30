/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PortBinding } from './PortBinding';

/**
 * PortMap describes the mapping of container ports to host ports, using the
 * container's port-number and protocol as key in the format `<port>/<protocol>`,
 * for example, `80/udp`.
 *
 * If a container's port is mapped for multiple protocols, separate entries
 * are added to the mapping table.
 * 
 */
export type PortMap = Record<string, Array<PortBinding> | null>;
