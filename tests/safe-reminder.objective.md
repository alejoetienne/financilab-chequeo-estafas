# Kane objective — safe reminder

**Goal:** Prove a protective bank reminder is labeled Seguro (not Estafa).

**Steps:**

1. Go to the app URL.
2. Click "Recordatorio seguro" (`data-testid="chip-seguro"`), OR paste:
   `Banpro: recordatorio. Su pago de tarjeta vence el 25 de este mes. Puede pagar en la app oficial Banpro o en sucursal. Nunca le pediremos su PIN por mensaje.`
3. Click Analizar.
4. Verify verdict shows **Seguro** / `data-verdict="safe"`.
5. Fail if it shows Estafa.

**English one-liner:**

> Go to the app. Click the chip labeled "Recordatorio seguro". Click Analizar. Verify the verdict shows Seguro or data-verdict="safe". Fail if it shows Estafa.
