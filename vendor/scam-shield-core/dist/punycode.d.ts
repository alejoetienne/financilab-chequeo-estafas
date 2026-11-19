/** Decode a single punycode label (without the "xn--" prefix). Throws on invalid input. */
export declare function decodePunycodeLabel(input: string): string;
/** Convert an ASCII (possibly xn--) hostname to Unicode. Invalid labels are left as-is. */
export declare function hostnameToUnicode(host: string): string;
//# sourceMappingURL=punycode.d.ts.map