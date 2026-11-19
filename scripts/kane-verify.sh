#!/usr/bin/env bash
# Closed-loop Kane CLI verifier for FinanciLab Chequeo de Estafas.
# Exit codes (Kane / hook contract):
#   0 — pass, or intentionally skipped (no credentials / docs-only)
#   2 — Kane failed or run_end reported failure (Claude Code PostToolUse/Stop should react)
#   3 — timeout / cancelled (if detected)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

APP_URL="${KANE_APP_URL:-http://127.0.0.1:5173}"
TIMEOUT="${KANE_TIMEOUT:-180}"
NDJSON_DIR="$ROOT/.testmuai"
NDJSON_FILE="$NDJSON_DIR/last-run.ndjson"
mkdir -p "$NDJSON_DIR"

# Optional: skip when SKIP_KANE=1
if [[ "${SKIP_KANE:-}" == "1" ]]; then
  echo "Kane skipped: SKIP_KANE=1" >&2
  exit 0
fi

# Debounce docs-only edits when Claude Code passes file paths via CLAUDE_HOOK_FILES or argv
docs_only=true
files_to_check=("$@")
if [[ ${#files_to_check[@]} -eq 0 && -n "${CLAUDE_HOOK_FILES:-}" ]]; then
  # shellcheck disable=SC2206
  files_to_check=($CLAUDE_HOOK_FILES)
fi
if [[ ${#files_to_check[@]} -gt 0 ]]; then
  for f in "${files_to_check[@]}"; do
    case "$f" in
      *.md|*.mdx|LICENSE|.gitignore|.env.example|docs/*|docs/**) ;;
      *) docs_only=false; break ;;
    esac
  done
  if $docs_only; then
    echo "Kane skipped: docs-only change" >&2
    exit 0
  fi
fi

if [[ -z "${LT_USERNAME:-}" || -z "${LT_ACCESS_KEY:-}" ]]; then
  echo "Kane skipped: LT_USERNAME / LT_ACCESS_KEY not set in the environment." >&2
  echo "Set both (never commit them), claim credits at https://www.testmuai.com/kane-cli/, then re-run: npm run kane:verify" >&2
  exit 0
fi

if ! command -v kane-cli >/dev/null 2>&1; then
  if ! command -v npx >/dev/null 2>&1; then
    echo "kane-cli not found and npx unavailable" >&2
    exit 2
  fi
  KANE_BIN=(npx --yes @testmuai/kane-cli)
else
  KANE_BIN=(kane-cli)
fi

# Start Vite if the app is not up
app_up=false
if curl -fsS --max-time 2 "$APP_URL" >/dev/null 2>&1; then
  app_up=true
fi

STARTED_APP=0
if ! $app_up; then
  echo "Starting app on $APP_URL …" >&2
  npm start >/tmp/financilab-kane-vite.log 2>&1 &
  STARTED_APP=$!
  for i in $(seq 1 60); do
    if curl -fsS --max-time 2 "$APP_URL" >/dev/null 2>&1; then
      app_up=true
      break
    fi
    sleep 1
  done
  if ! $app_up; then
    echo "App failed to start. Log:" >&2
    tail -n 40 /tmp/financilab-kane-vite.log >&2 || true
    [[ "$STARTED_APP" -ne 0 ]] && kill "$STARTED_APP" 2>/dev/null || true
    exit 2
  fi
fi

cleanup() {
  if [[ "${STARTED_APP:-0}" -ne 0 ]]; then
    kill "$STARTED_APP" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Prefer saved testmd files when present; otherwise run natural-language objectives
SCAM_TEST="$ROOT/tests/scam_sms_test.md"
SAFE_TEST="$ROOT/tests/safe_reminder_test.md"

run_kane() {
  local label="$1"
  shift
  echo "=== Kane: $label ===" >&2
  set +e
  KANE_CLI_USER_AGENT=claude-code \
    "${KANE_BIN[@]}" "$@" \
    --username "$LT_USERNAME" \
    --access-key "$LT_ACCESS_KEY" \
    --agent --headless --timeout "$TIMEOUT" \
    2> >(tee /tmp/kane-stderr.log >&2) | tee "$NDJSON_FILE"
  local code=${PIPESTATUS[0]}
  set -e

  # Parse last run_end from NDJSON if present
  local status=""
  if [[ -f "$NDJSON_FILE" ]]; then
    status=$(python3 - <<'PY' "$NDJSON_FILE" 2>/dev/null || true
import json,sys
path=sys.argv[1]
status=""
try:
  with open(path) as f:
    for line in f:
      line=line.strip()
      if not line: continue
      try:
        ev=json.loads(line)
      except Exception:
        continue
      if ev.get("type")=="run_end" or ev.get("event")=="run_end":
        status=str(ev.get("status") or ev.get("result") or ev.get("outcome") or "")
except Exception:
  pass
print(status)
PY
)
  fi

  if [[ "$code" -eq 0 ]]; then
    if [[ -n "$status" && "$status" =~ [Ff]ail ]]; then
      echo "Kane reported failure in run_end (status=$status). See $NDJSON_FILE" >&2
      return 2
    fi
    return 0
  fi
  if [[ "$code" -eq 3 ]]; then
    echo "Kane timed out or was cancelled (exit 3)." >&2
    return 3
  fi
  echo "Kane failed (exit $code). NDJSON: $NDJSON_FILE" >&2
  # Print a short report for Claude Code hooks (stderr → agent)
  if [[ -f "$NDJSON_FILE" ]]; then
    echo "---- last NDJSON lines ----" >&2
    tail -n 30 "$NDJSON_FILE" >&2 || true
  fi
  return 2
}

OVERALL=0

if [[ -f "$SCAM_TEST" && -f "$SAFE_TEST" ]] && grep -qE '^---|objective:|steps:' "$SCAM_TEST" 2>/dev/null; then
  # Saved tests present — replay both
  if ! run_kane "scam SMS flow" testmd run "$SCAM_TEST" --url "$APP_URL"; then OVERALL=2; fi
  if ! run_kane "safe reminder flow" testmd run "$SAFE_TEST" --url "$APP_URL"; then OVERALL=2; fi
else
  OBJ_SCAM='Go to the app. Click the button or chip labeled "Estafa Banpro" (data-testid chip-estafa). Click Analizar (data-testid btn-analizar). Verify the verdict area (data-testid verdict) shows Estafa or has data-verdict="scam". Fail if it shows Seguro.'
  OBJ_SAFE='Go to the app. Click the chip labeled "Recordatorio seguro" (data-testid chip-seguro). Click Analizar. Verify the verdict shows Seguro or data-verdict="safe". Fail if it shows Estafa.'

  if ! run_kane "scam SMS objective" run "$OBJ_SCAM" --url "$APP_URL" --name "financilab-scam-sms"; then OVERALL=2; fi
  if ! run_kane "safe reminder objective" run "$OBJ_SAFE" --url "$APP_URL" --name "financilab-safe-reminder"; then OVERALL=2; fi
fi

exit "$OVERALL"
