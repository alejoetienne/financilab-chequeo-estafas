/** Lowercase, strip diacritics (á→a, ñ→n) and collapse whitespace. */
export declare function normalizeText(s: string): string;
/** Split text into rough sentences/clauses for context-sensitive rules. */
export declare function splitSentences(s: string): string[];
export declare function levenshtein(a: string, b: string): number;
//# sourceMappingURL=normalize.d.ts.map