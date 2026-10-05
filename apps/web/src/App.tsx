import { useMemo, useState } from 'react'
import type { Finding, Severity } from '../../packages/scanner-core/types'

const findings: Finding[] = [
  {
    ruleId: 'supabase/service-role-in-client',
    title: 'Supabase service-role credential referenced from client code',
    severity: 'critical',
    file: 'src/lib/supabase.ts',
    line: 14,
    evidence: "SUPABASE_SERVICE_ROLE_KEY = '[REDACTED]'",
    remediation: 'Move privileged Supabase operations to a trusted server or edge function.',
  },
  {
    ruleId: 'web/wildcard-cors',
    title: 'Wildcard CORS origin detected',
    severity: 'medium',
    file: 'server/api.ts',
    line: 31,
    evidence: "origin: '*'",
    remediation: 'Restrict CORS to explicitly trusted origins.',
  },
]

const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

function App() {
  const [selected, setSelected] = useState<Finding>(findings[0]!)
  const counts = useMemo(
    () => Object.fromEntries(severities.map((severity) => [severity, findings.filter((f) => f.severity === severity).length])),
    [],
  )

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">REPOSITORY SECURITY INTELLIGENCE</span>
          <h1>CodeSentryX</h1>
        </div>
        <div className="status"><span /> Scanner online</div>
      </header>

      <section className="hero">
        <div>
          <p className="muted">karisajoshua / example-repository</p>
          <h2>Security posture</h2>
          <p className="lede">Actionable repository findings with explainable rules and remediation.</p>
        </div>
        <div className="score">
          <strong>68</strong><span>/100</span>
          <small>Needs attention</small>
        </div>
      </section>

      <section className="metrics">
        {severities.map((severity) => (
          <article key={severity}>
            <span className={`dot ${severity}`} />
            <strong>{counts[severity]}</strong>
            <small>{severity}</small>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel findings">
          <div className="panelHead"><div><span className="eyebrow">LATEST SCAN</span><h3>Findings</h3></div><span className="pill">{findings.length} open</span></div>
          {findings.map((finding) => (
            <button className={`finding ${selected.ruleId === finding.ruleId ? 'active' : ''}`} key={finding.ruleId} onClick={() => setSelected(finding)}>
              <span className={`severity ${finding.severity}`}>{finding.severity}</span>
              <span className="findingBody"><strong>{finding.title}</strong><small>{finding.file}:{finding.line}</small></span>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>

        <aside className="panel detail">
          <span className={`severity ${selected.severity}`}>{selected.severity}</span>
          <h3>{selected.title}</h3>
          <code>{selected.ruleId}</code>
          <div className="detailBlock"><small>LOCATION</small><p>{selected.file}:{selected.line}</p></div>
          <div className="detailBlock"><small>EVIDENCE</small><pre>{selected.evidence}</pre></div>
          <div className="detailBlock remediation"><small>REMEDIATION</small><p>{selected.remediation}</p></div>
        </aside>
      </section>
    </main>
  )
}

export default App
