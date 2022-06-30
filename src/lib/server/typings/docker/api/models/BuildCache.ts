/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BuildCache = {
    ID?: string;
    Parent?: string;
    Type?: string;
    Description?: string;
    InUse?: boolean;
    Shared?: boolean;
    /**
     * Amount of disk space used by the build cache (in bytes).
 * 
     */
    Size?: number;
    /**
     * Date and time at which the build cache was created in
 * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
 * 
     */
    CreatedAt?: string;
    /**
     * Date and time at which the build cache was last used in
 * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
 * 
     */
    LastUsedAt?: string | null;
    UsageCount?: number;
};
