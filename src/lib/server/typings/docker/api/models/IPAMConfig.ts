/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IPAMConfig = {
    Subnet?: string;
    IPRange?: string;
    Gateway?: string;
    AuxiliaryAddresses?: Record<string, string>;
};
