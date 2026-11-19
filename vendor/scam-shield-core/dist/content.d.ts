import type { Category, Locale, Signal, Verdict } from './types.js';
export declare const CATEGORY_LABELS: Record<Category, {
    es: string;
    en: string;
}>;
export declare const ADVICE: Record<Category, {
    es: string;
    en: string;
}>;
export declare function buildExplanation(verdict: Verdict, category: Category, signals: Signal[], locale: Locale): string;
//# sourceMappingURL=content.d.ts.map