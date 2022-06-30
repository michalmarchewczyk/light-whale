/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A descriptor struct containing digest, media type, and size, as defined in
 * the [OCI Content Descriptors Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/descriptor.md).
 * 
 */
export type OCIDescriptor = {
    /**
     * The media type of the object this schema refers to.
 * 
     */
    mediaType?: string;
    /**
     * The digest of the targeted content.
 * 
     */
    digest?: string;
    /**
     * The size in bytes of the blob.
 * 
     */
    size?: number;
};
