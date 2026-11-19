# Kane objective — scam SMS (Banpro lookalike)

**Goal:** Prove the app flags a Banpro-style phishing SMS as Estafa.

**Steps for Kane CLI (`kane-cli run`):**

1. Go to http://127.0.0.1:5173 (or `--url`).
2. Click the chip "Estafa Banpro" (`data-testid="chip-estafa"`), OR paste into `data-testid="input-message"`:
   `Banpro: su cuenta será bloqueada en 24 horas por actividad inusual. Confirme su PIN en https://banpr0.top/verificar para evitar el bloqueo.`
3. Click Analizar (`data-testid="btn-analizar"`).
4. Verify the verdict region (`data-testid="verdict"`) shows **Estafa** and/or `data-verdict="scam"`.
5. Fail if the verdict is Seguro / `data-verdict="safe"`.

**English one-liner for Kane:**

> Go to the app. Click the chip labeled "Estafa Banpro". Click Analizar. Verify the verdict shows Estafa or data-verdict="scam". Fail if it shows Seguro.
