import type { AnalysisResult, Category, Locale } from './types.js';
/**
 * Draft a short, safe reply the user can send (or simply not send — ignoring
 * and blocking is always fine). Accepts an analysis result or a category.
 */
export declare function draftSafeReply(resultOrCategory: AnalysisResult | Category, locale?: Locale): string;
/** Short educational tip for a category. `seed` lets callers rotate between tips. */
export declare function educationTip(category?: Category, locale?: Locale, seed?: number): string;
//# sourceMappingURL=helpers.d.ts.map