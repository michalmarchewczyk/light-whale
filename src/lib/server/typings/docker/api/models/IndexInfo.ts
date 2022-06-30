/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * IndexInfo contains information about a registry.
 */
export type IndexInfo = {
    /**
     * Name of the registry, such as "docker.io".
 * 
     */
    Name?: string;
    /**
     * List of mirrors, expressed as URIs.
 * 
     */
    Mirrors?: Array<string>;
    /**
     * Indicates if the registry is part of the list of insecure
 * registries.
 *
 * If `false`, the registry is insecure. Insecure registries accept
 * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
 * unknown CAs) communication.
 *
 * > **Warning**: Insecure registries can be useful when running a local
 * > registry. However, because its use creates security vulnerabilities
 * > it should ONLY be enabled for testing purposes. For increased
 * > security, users should add their CA to their system's list of
 * > trusted CAs instead of enabling this option.
 * 
     */
    Secure?: boolean;
    /**
     * Indicates whether this is an official registry (i.e., Docker Hub / docker.io)
 * 
     */
    Official?: boolean;
};
