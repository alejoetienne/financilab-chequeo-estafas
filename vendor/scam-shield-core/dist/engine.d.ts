import { type RuleHit } from './rules.js';
import type { AnalysisResult, AnalyzeInput, Category, Signal, Verdict } from './types.js';
export declare const THRESHOLDS: {
    readonly scam: 60;
    readonly suspicious: 25;
};
export declare function verdictFor(score: number): Verdict;
/** Noisy-OR combination of positive weights, then negative weights subtract. */
export declare function combineScore(signals: Pick<Signal, 'weight'>[]): number;
export declare function pickCategory(hits: RuleHit[]): Category;
export declare function finalize(score: number, category: Category, signals: Signal[], llmUsed: boolean, extra?: {
    es?: string;
    en?: string;
}): AnalysisResult;
/** Synchronous, fully offline rules-only analysis. */
export declare function analyzeRules(input: AnalyzeInput): AnalysisResult;
//# sourceMappingURL=engine.d.ts.map