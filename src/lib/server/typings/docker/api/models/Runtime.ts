/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Runtime describes an [OCI compliant](https://github.com/opencontainers/runtime-spec)
 * runtime.
 *
 * The runtime is invoked by the daemon via the `containerd` daemon. OCI
 * runtimes act as an interface to the Linux kernel namespaces, cgroups,
 * and SELinux.
 * 
 */
export type Runtime = {
    /**
     * Name and, optional, path, of the OCI executable binary.
 *
 * If the path is omitted, the daemon searches the host's `$PATH` for the
 * binary and uses the first result.
 * 
     */
    path?: string;
    /**
     * List of command-line arguments to pass to the runtime when invoked.
 * 
     */
    runtimeArgs?: Array<string> | null;
};
