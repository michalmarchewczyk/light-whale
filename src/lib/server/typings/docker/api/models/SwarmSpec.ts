/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * User modifiable swarm configuration.
 */
export type SwarmSpec = {
    /**
     * Name of the swarm.
     */
    Name?: string;
    /**
     * User-defined key/value metadata.
     */
    Labels?: Record<string, string>;
    /**
     * Orchestration configuration.
     */
    Orchestration?: {
/**
 * The number of historic tasks to keep per instance or node. If
 * negative, never remove completed or failed tasks.
 * 
 */
TaskHistoryRetentionLimit?: number;
} | null;
    /**
     * Raft configuration.
     */
    Raft?: {
/**
 * The number of log entries between snapshots.
 */
SnapshotInterval?: number;
/**
 * The number of snapshots to keep beyond the current snapshot.
 * 
 */
KeepOldSnapshots?: number;
/**
 * The number of log entries to keep around to sync up slow followers
 * after a snapshot is created.
 * 
 */
LogEntriesForSlowFollowers?: number;
/**
 * The number of ticks that a follower will wait for a message from
 * the leader before becoming a candidate and starting an election.
 * `ElectionTick` must be greater than `HeartbeatTick`.
 *
 * A tick currently defaults to one second, so these translate
 * directly to seconds currently, but this is NOT guaranteed.
 * 
 */
ElectionTick?: number;
/**
 * The number of ticks between heartbeats. Every HeartbeatTick ticks,
 * the leader will send a heartbeat to the followers.
 *
 * A tick currently defaults to one second, so these translate
 * directly to seconds currently, but this is NOT guaranteed.
 * 
 */
HeartbeatTick?: number;
};
    /**
     * Dispatcher configuration.
     */
    Dispatcher?: {
/**
 * The delay for an agent to send a heartbeat to the dispatcher.
 * 
 */
HeartbeatPeriod?: number;
} | null;
    /**
     * CA configuration.
     */
    CAConfig?: {
/**
 * The duration node certificates are issued for.
 */
NodeCertExpiry?: number;
/**
 * Configuration for forwarding signing requests to an external
 * certificate authority.
 * 
 */
ExternalCAs?: Array<{
/**
 * Protocol for communication with the external CA (currently
 * only `cfssl` is supported).
 * 
 */
Protocol?: 'cfssl';
/**
 * URL where certificate signing requests should be sent.
 * 
 */
URL?: string;
/**
 * An object with key/value pairs that are interpreted as
 * protocol-specific options for the external CA driver.
 * 
 */
Options?: Record<string, string>;
/**
 * The root CA certificate (in PEM format) this external CA uses
 * to issue TLS certificates (assumed to be to the current swarm
 * root CA certificate if not provided).
 * 
 */
CACert?: string;
}>;
/**
 * The desired signing CA certificate for all swarm node TLS leaf
 * certificates, in PEM format.
 * 
 */
SigningCACert?: string;
/**
 * The desired signing CA key for all swarm node TLS leaf certificates,
 * in PEM format.
 * 
 */
SigningCAKey?: string;
/**
 * An integer whose purpose is to force swarm to generate a new
 * signing CA certificate and key, if none have been specified in
 * `SigningCACert` and `SigningCAKey`
 * 
 */
ForceRotate?: number;
} | null;
    /**
     * Parameters related to encryption-at-rest.
     */
    EncryptionConfig?: {
/**
 * If set, generate a key and use it to lock data stored on the
 * managers.
 * 
 */
AutoLockManagers?: boolean;
};
    /**
     * Defaults for creating tasks in this cluster.
     */
    TaskDefaults?: {
/**
 * The log driver to use for tasks created in the orchestrator if
 * unspecified by a service.
 *
 * Updating this value only affects new tasks. Existing tasks continue
 * to use their previously configured log driver until recreated.
 * 
 */
LogDriver?: {
/**
 * The log driver to use as a default for new tasks.
 * 
 */
Name?: string;
/**
 * Driver-specific options for the selectd log driver, specified
 * as key/value pairs.
 * 
 */
Options?: Record<string, string>;
};
};
};
