# Kane evidence pack

Judges score **Verified** and **Closed loop**. Keep both a failed run and a green run here once `LT_USERNAME` and `LT_ACCESS_KEY` are available.

## What to drop in this folder

| File | Purpose |
| --- | --- |
| `failed-run.ndjson` | Copy of `.testmuai/last-run.ndjson` from a deliberate bug Kane caught |
| `green-run.ndjson` | Copy after the fix, when both flows pass |
| `notes.md` | Optional: what bug was injected, what Claude Code changed, timestamps (America/Managua) |

## How to capture

```bash
export LT_USERNAME=…   # never commit
export LT_ACCESS_KEY=…

# 1) Introduce a deliberate UI bug (e.g. wrong verdict label), save, let the hook fail
npm run kane:verify
cp .testmuai/last-run.ndjson docs/evidence/failed-run.ndjson

# 2) Fix the bug, re-run until green
npm run kane:verify
cp .testmuai/last-run.ndjson docs/evidence/green-run.ndjson
```

Also copy any Kane evidence-pack folder or Test Manager `test_url` into `notes.md`.

Placeholders below are empty until credentials arrive.
