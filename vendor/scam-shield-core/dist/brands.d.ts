export type BrandKind = 'bank' | 'payment' | 'remittance' | 'messaging';
export interface Brand {
    id: string;
    name: string;
    kind: BrandKind;
    /** Regex (on normalized text) that detects the brand being mentioned. */
    mention: RegExp;
    /** Domains considered official (host equals or is a subdomain of these). */
    domains: string[];
    /** Tokens used to detect lookalike domains. */
    tokens: string[];
}
/**
 * Official domains are a best-effort allowlist for heuristics only. Always
 * verify against the institution's published channels before relying on it.
 */
export declare const BRANDS: Brand[];
export declare const BRAND_BY_ID: Record<string, Brand>;
//# sourceMappingURL=brands.d.ts.map