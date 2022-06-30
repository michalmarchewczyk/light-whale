/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An open port on a container
 */
export type Port = {
    /**
     * Host IP address that the container's port is mapped to
     */
    IP?: string;
    /**
     * Port on the container
     */
    PrivatePort: number;
    /**
     * Port exposed on the host
     */
    PublicPort?: number;
    Type: Port.Type;
};

export namespace Port {

    export enum Type {
        TCP = 'tcp',
        UDP = 'udp',
        SCTP = 'sctp',
    }


}
