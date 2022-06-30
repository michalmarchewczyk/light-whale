/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * PortBinding represents a binding between a host IP address and a host
 * port.
 * 
 */
export type PortBinding = {
    /**
     * Host IP address that the container's port is mapped to.
     */
    HostIp?: string;
    /**
     * Host port number that the container's port is mapped to.
     */
    HostPort?: string;
};
