import { analyzeRules } from './engine.js';
import type { AnalysisResult, AnalyzeInput, AnalyzeOptions } from './types.js';
export { analyzeRules };
/**
 * Analyze a message/link. Uses the rules engine and, when configured
 * (SCAM_SHIELD_LLM + API key, or `opts.llm`), blends in an LLM assessment.
 * Any LLM error, timeout, invalid output or missing key falls back to rules only.
 */
export declare function analyze(input: AnalyzeInput, opts?: AnalyzeOptions): Promise<AnalysisResult>;
//# sourceMappingURL=analyze.d.ts.map