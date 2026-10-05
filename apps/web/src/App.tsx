import { useMemo, useState, type ChangeEvent } from 'react'
import { calculateSecurityScore, securityScoreLabel } from '../../../packages/reporters/security-score'
import type { Finding, Severity } from '../../../packages/scanner-core/types'
import { parseScanReport } from './report-parser'

const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

function App() {
  const [findings, setFindings] = useState<readonly Finding[]>([])
  const [selected, setSelected] = useState<Finding | null>(null)
  const [sourceName, setSourceName] = useState('No report loaded')
  const [error, setError] = useState<string | null>(null)

  const score = useMemo(() => calculateSecurityScore(findings), [findings])
  const counts = useMemo(
    () => Object.fromEntries(severities.map((severity) => [severity, findings.filter((f) => f.severity === severity).length])),
    [findings],
  )

  async function importReport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const parsed: unknown = JSON.parse(await file.text())
      const nextFindings = parseScanReport(parsed)
      setFindings(nextFindings)
      setSelected(nextFindings[0] ?? null)
      setSourceName(file.name)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to read this report.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div><span className="eyebrow">REPOSITORY SECURITY INTELLIGENCE</span><h1>CodeSentryX</h1></div>
        <label className="importButton">Import scan<input type="file" accept="application/json,.json" onChange={importReport} /></label>
      </header>

      <section className="hero">
        <div>
          <p className="muted">{sourceName}</p>
          <h2>Security posture</h2>
          <p className="lede">Import JSON generated with <code>codesentryx scan . --json</code>. Reports are processed locally in your browser.</p>
          {error && <p className="error" role="alert">{error}</p>}
        </div>
        <div className="score"><strong>{score}</strong><span>/100</span><small>{securityScoreLabel(score)}</small></div>
      </section>

      <section className="metrics">
        {severities.map((severity) => <article key={severity}><span className={`dot ${severity}`} /><strong>{counts[severity]}</strong><small>{severity}</small></article>)}
      </section>

      <section className="workspace">
        <div className="panel findings">
          <div className="panelHead"><div><span className="eyebrow">IMPORTED SCAN</span><h3>Findings</h3></div><span className="pill">{findings.length} open</span></div>
          {findings.length === 0 ? (
            <div className="empty"><strong>No findings loaded</strong><p>Generate a JSON report with the CLI and import it here to inspect repository security posture.</p></div>
          ) : findings.map((finding, index) => (
            <button className={`finding ${selected === finding ? 'active' : ''}`} key={`${finding.ruleId}-${finding.file}-${finding.line ?? index}`} onClick={() => setSelected(finding)}>
              <span className={`severity ${finding.severity}`}>{finding.severity}</span>
              <span className="findingBody"><strong>{finding.title}</strong><small>{finding.file}{finding.line ? `:${finding.line}` : ''}</small></span><span className="arrow">→</span>
            </button>
          ))}
        </div>

        <aside className="panel detail">
          {selected ? <>
            <span className={`severity ${selected.severity}`}>{selected.severity}</span><h3>{selected.title}</h3><code>{selected.ruleId}</code>
            <div className="detailBlock"><small>LOCATION</small><p>{selected.file}{selected.line ? `:${selected.line}` : ''}</p></div>
            <div className="detailBlock"><small>EVIDENCE</small><pre>{selected.evidence}</pre></div>
            <div className="detailBlock remediation"><small>REMEDIATION</small><p>{selected.remediation}</p></div>
          </> : <div className="empty"><strong>Finding details</strong><p>Select a finding after importing a scan report.</p></div>}
        </aside>
      </section>
    </main>
  )
}

export default App
