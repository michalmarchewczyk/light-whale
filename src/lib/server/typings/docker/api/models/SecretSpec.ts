/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Driver } from './Driver';

export type SecretSpec = {
    /**
     * User-defined name of the secret.
     */
    Name?: string;
    /**
     * User-defined key/value metadata.
     */
    Labels?: Record<string, string>;
    /**
     * Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5))
 * data to store as secret.
 *
 * This field is only used to _create_ a secret, and is not returned by
 * other endpoints.
 * 
     */
    Data?: string;
    /**
     * Name of the secrets driver used to fetch the secret's value from an
 * external secret store.
 * 
     */
    Driver?: Driver;
    /**
     * Templating driver, if applicable
 *
 * Templating controls whether and how to evaluate the config payload as
 * a template. If no driver is set, no templating is used.
 * 
     */
    Templating?: Driver;
};
