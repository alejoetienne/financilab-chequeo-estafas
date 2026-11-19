# FinanciLab Chequeo de Estafas

Spanish-first web app for people in **Nicaragua and Latin America** who need to check a bank, PayPal, remittance, or crypto SMS / WhatsApp message **before** they tap a link or share a code.

Paste the text → tap **Analizar** → get a clear **Seguro / Sospechoso / Estafa** verdict with a Spanish explanation. Analysis runs **entirely in the browser** via the MIT library [`scam-shield-core`](https://github.com/alejoetienne/scam-shield-core) (heuristics only — no API key required for judges).

Built for the **Kane CLI Online Hackathon** (TestMu AI) with **Claude Code**. Lane 1: apps that verify themselves.

## One-command run

```bash
npm install && npm start
```

Open [http://localhost:5173](http://localhost:5173).

Alternative: `npm run build && npm run preview` (production build on port 4173).

**Node.js 18+** required. Use **npm** (not pnpm) if you also install Kane CLI globally.

## Demo chips

| Chip | Expected verdict |
| --- | --- |
| Estafa Banpro | Estafa (lookalike domain + PIN pressure) |
| Recordatorio seguro | Seguro (official tone, “nunca le pediremos su PIN”) |
| PayPal falso | Estafa / Sospechoso (PayPal lookalike) |

`data-testid` hooks for automation: `input-message`, `btn-analizar`, `chip-estafa`, `chip-seguro`, `chip-paypal`, `verdict` (+ `data-verdict`), `explanation`.

## Kane CLI closed loop

Claude Code hooks (`.claude/settings.json`) call `scripts/kane-verify.sh` on **PostToolUse** (`Edit`/`Write`) and on **Stop**:

1. Skip if `SKIP_KANE=1`, docs-only edits, or missing credentials.
2. Start the Vite app if needed.
3. Run Kane headless with `--agent` against the scam and safe flows.
4. Write NDJSON to `.testmuai/last-run.ndjson`.
5. On failure: print a short report to **stderr** and **exit 2** so Claude Code can patch and re-run.

### Credentials (never commit)

```bash
export LT_USERNAME="your-testmu-username"
export LT_ACCESS_KEY="your-access-key"   # from TestMu / LambdaTest dashboard → Credentials
npm run kane:verify
```

Claim hackathon credits at [testmuai.com/kane-cli](https://www.testmuai.com/kane-cli/). See `.env.example`.

Manual one-off (example):

```bash
KANE_CLI_USER_AGENT=claude-code kane-cli run \
  'Go to the app. Click "Estafa Banpro". Click Analizar. Verify verdict Estafa.' \
  --url http://127.0.0.1:5173 --agent --headless --timeout 180 \
  --username "$LT_USERNAME" --access-key "$LT_ACCESS_KEY"
```

Objectives and draft `test.md` files live in `tests/`. After the first green run, replace the drafts with Kane-saved `_test.md` so replays hit the cache.

Evidence placeholders: `docs/evidence/` (failed + green NDJSON once Kane can authenticate).

Agent instructions: `AGENTS.md` / `CLAUDE.md`. Skill: `.claude/skills/kane-cli/`.

## Project layout

```
src/                 React UI (Spanish)
vendor/scam-shield-core/   Vendored MIT detector (offline)
scripts/kane-verify.sh     Hook entrypoint
tests/                   Kane objectives + draft testmd
docs/evidence/           Failed/green run artifacts
.claude/settings.json    PostToolUse + Stop hooks
```

## Screenshots

Add screenshots of the Estafa and Seguro verdicts here after recording the demo video.

## License

MIT © 2026 Alejandro Arana / FinanciLab
