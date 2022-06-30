/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Commit holds the Git-commit (SHA1) that a binary was built from, as
 * reported in the version-string of external tools, such as `containerd`,
 * or `runC`.
 * 
 */
export type Commit = {
    /**
     * Actual commit ID of external tool.
     */
    ID?: string;
    /**
     * Commit ID of external tool expected by dockerd as set at build time.
 * 
     */
    Expected?: string;
};
