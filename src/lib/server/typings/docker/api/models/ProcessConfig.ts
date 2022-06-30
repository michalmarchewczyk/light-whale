/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProcessConfig = {
    privileged?: boolean;
    user?: string;
    tty?: boolean;
    entrypoint?: string;
    arguments?: Array<string>;
};
