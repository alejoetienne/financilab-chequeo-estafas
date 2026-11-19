import { type Brand } from './brands.js';
import type { AnalyzeInput, Category, Signal } from './types.js';
import { type ParsedUrl } from './url.js';
export interface RuleContext {
    original: string;
    text: string;
    sentences: string[];
    /** Sentences that are not protective warnings ("nunca le pediremos su PIN"). */
    activeSentences: string[];
    urls: ParsedUrl[];
    brands: Brand[];
}
export interface RuleHit extends Signal {
    category?: Category;
}
export declare function buildContext(input: AnalyzeInput): RuleContext;
/** Run every offline rule and return the matching signals. */
export declare function runRules(ctx: RuleContext): RuleHit[];
//# sourceMappingURL=rules.d.ts.map