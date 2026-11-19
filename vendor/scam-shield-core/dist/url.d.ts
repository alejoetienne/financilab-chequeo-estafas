import { type Brand } from './brands.js';
export declare const RISKY_TLDS: Set<string>;
export declare const SHORTENERS: Set<string>;
export interface ParsedUrl {
    raw: string;
    /** Hostname as written (lowercased), may contain Unicode or xn-- labels. */
    host: string;
    /** Hostname converted to Unicode (punycode decoded). */
    unicodeHost: string;
    scheme: 'http' | 'https' | 'none';
    hasUserInfo: boolean;
    isIp: boolean;
    tld: string;
    /** Registrable domain, e.g. "banpro.com.ni". */
    registrable: string;
    isIdn: boolean;
    path: string;
}
export declare function parseUrl(rawInput: string): ParsedUrl | null;
/** Find URL-like tokens inside free text (with or without scheme). */
export declare function extractUrls(text: string): string[];
/** Reduce a label to a Latin skeleton for lookalike comparison. */
export declare function skeleton(label: string): string;
export declare function isOfficialFor(parsed: ParsedUrl, brand: Brand): boolean;
export declare function isOfficialAny(parsed: ParsedUrl): Brand | undefined;
/** Returns the brand a domain imitates (but does not belong to), if any. */
export declare function detectLookalike(parsed: ParsedUrl): Brand | undefined;
//# sourceMappingURL=url.d.ts.map