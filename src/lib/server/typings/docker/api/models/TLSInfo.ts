/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Information about the issuer of leaf TLS certificates and the trusted root
 * CA certificate.
 * 
 */
export type TLSInfo = {
    /**
     * The root CA certificate(s) that are used to validate leaf TLS
 * certificates.
 * 
     */
    TrustRoot?: string;
    /**
     * The base64-url-safe-encoded raw subject bytes of the issuer.
     */
    CertIssuerSubject?: string;
    /**
     * The base64-url-safe-encoded raw public key bytes of the issuer.
 * 
     */
    CertIssuerPublicKey?: string;
};
