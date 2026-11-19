import { useEffect, useMemo, useState } from 'react'
import { analyzeRules, type AnalysisResult, type Verdict } from 'scam-shield-core'
import { EXAMPLES, type ExampleId } from './examples'

const VERDICT_ES: Record<Verdict, string> = {
  safe: 'Seguro',
  suspicious: 'Sospechoso',
  scam: 'Estafa',
}

function verdictClass(v: Verdict): string {
  if (v === 'safe') return 'verdict-safe'
  if (v === 'suspicious') return 'verdict-suspicious'
  return 'verdict-scam'
}

function demoFromQuery(): ExampleId | null {
  const q = new URLSearchParams(window.location.search).get('demo')
  if (q === 'estafa' || q === 'seguro' || q === 'paypal') return q
  return null
}

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [activeChip, setActiveChip] = useState<ExampleId | null>(null)

  const canAnalyze = useMemo(() => text.trim().length > 0, [text])

  function loadExample(id: ExampleId, analyze = false) {
    const sample = EXAMPLES[id].text
    setText(sample)
    setActiveChip(id)
    if (analyze) {
      setResult(analyzeRules({ text: sample, locale: 'es' }))
    } else {
      setResult(null)
    }
  }

  useEffect(() => {
    const demo = demoFromQuery()
    if (demo) loadExample(demo, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onAnalyze() {
    const trimmed = text.trim()
    if (!trimmed) return
    const r = analyzeRules({ text: trimmed, locale: 'es' })
    setResult(r)
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="logo" aria-hidden>
            ✓
          </span>
          <div>
            <h1>FinanciLab Chequeo de Estafas</h1>
            <p className="subtitle">
              Pegá un SMS, WhatsApp o enlace de banco, PayPal, remesa o cripto
              antes de tocar el link o compartir un código.
            </p>
          </div>
        </div>
      </header>

      <main className="card">
        <label className="label" htmlFor="message">
          Mensaje o enlace
        </label>
        <textarea
          id="message"
          data-testid="input-message"
          className="textarea"
          rows={6}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setActiveChip(null)
            setResult(null)
          }}
          placeholder="Ejemplo: Banpro: su cuenta será bloqueada… Confirme su PIN en https://…"
        />

        <div className="chips" role="group" aria-label="Ejemplos">
          {(Object.keys(EXAMPLES) as ExampleId[]).map((id) => (
            <button
              key={id}
              type="button"
              data-testid={EXAMPLES[id].testId}
              className={`chip ${activeChip === id ? 'chip-active' : ''}`}
              onClick={() => loadExample(id)}
            >
              {EXAMPLES[id].label}
            </button>
          ))}
        </div>

        <button
          type="button"
          data-testid="btn-analizar"
          className="btn-primary"
          disabled={!canAnalyze}
          onClick={onAnalyze}
        >
          Analizar
        </button>

        {result && (
          <section
            className={`verdict ${verdictClass(result.verdict)}`}
            data-testid="verdict"
            data-verdict={result.verdict}
            aria-live="polite"
          >
            <div className="verdict-top">
              <span className="verdict-label">{VERDICT_ES[result.verdict]}</span>
              <span className="verdict-score">Riesgo {result.riskScore}/100</span>
            </div>
            <p className="verdict-explanation" data-testid="explanation">
              {result.explanationEs}
            </p>
            <p className="verdict-advice">
              <strong>Consejo:</strong> {result.adviceEs}
            </p>
            {result.signals.length > 0 && (
              <ul className="signals">
                {result.signals.slice(0, 6).map((s) => (
                  <li key={s.id}>{s.reasonEs}</li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Análisis local con{' '}
          <a
            href="https://github.com/alejoetienne/scam-shield-core"
            target="_blank"
            rel="noreferrer"
          >
            scam-shield-core
          </a>{' '}
          (MIT). No se envían datos a ningún servidor.
        </p>
        <p className="disclaimer">
          Herramienta heurística: reduce riesgo, no garantiza que un mensaje sea
          seguro. Verificá siempre con tu banco por el canal oficial.
        </p>
      </footer>
    </div>
  )
}
