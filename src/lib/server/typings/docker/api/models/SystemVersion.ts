/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response of Engine API: GET "/version"
 * 
 */
export type SystemVersion = {
    Platform?: {
Name: string;
};
    /**
     * Information about system components
 * 
     */
    Components?: Array<{
/**
 * Name of the component
 * 
 */
Name: string;
/**
 * Version of the component
 * 
 */
Version: string;
/**
 * Key/value pairs of strings with additional information about the
 * component. These values are intended for informational purposes
 * only, and their content is not defined, and not part of the API
 * specification.
 *
 * These messages can be printed by the client as information to the user.
 * 
 */
Details?: any;
}>;
    /**
     * The version of the daemon
     */
    Version?: string;
    /**
     * The default (and highest) API version that is supported by the daemon
 * 
     */
    ApiVersion?: string;
    /**
     * The minimum API version that is supported by the daemon
 * 
     */
    MinAPIVersion?: string;
    /**
     * The Git commit of the source code that was used to build the daemon
 * 
     */
    GitCommit?: string;
    /**
     * The version Go used to compile the daemon, and the version of the Go
 * runtime in use.
 * 
     */
    GoVersion?: string;
    /**
     * The operating system that the daemon is running on ("linux" or "windows")
 * 
     */
    Os?: string;
    /**
     * The architecture that the daemon is running on
 * 
     */
    Arch?: string;
    /**
     * The kernel version (`uname -r`) that the daemon is running on.
 *
 * This field is omitted when empty.
 * 
     */
    KernelVersion?: string;
    /**
     * Indicates if the daemon is started with experimental features enabled.
 *
 * This field is omitted when empty / false.
 * 
     */
    Experimental?: boolean;
    /**
     * The date and time that the daemon was compiled.
 * 
     */
    BuildTime?: string;
};
