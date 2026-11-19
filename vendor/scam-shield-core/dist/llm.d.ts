import type { AnalyzeOptions, LlmAssessment, LlmProviderName, Signal } from './types.js';
export declare const DEFAULT_MODELS: Record<Exclude<LlmProviderName, 'none'>, string>;
export interface ResolvedProvider {
    name: Exclude<LlmProviderName, 'none'>;
    apiKey: string;
    model: string;
}
/** Decide which provider to use; returns null when the LLM layer is disabled or unconfigured. */
export declare function resolveProvider(opts?: AnalyzeOptions): ResolvedProvider | null;
export declare const SYSTEM_PROMPT: string;
export declare function buildUserPrompt(text: string, url: string | undefined, ruleSignals: Signal[]): string;
/** Extract and validate the JSON assessment from model text. Returns null if invalid. */
export declare function parseAssessment(textOut: string): LlmAssessment | null;
/** Call the configured provider. Throws on any network/format error (caller falls back). */
export declare function callLlm(provider: ResolvedProvider, userPrompt: string, opts?: AnalyzeOptions): Promise<LlmAssessment>;
//# sourceMappingURL=llm.d.ts.map