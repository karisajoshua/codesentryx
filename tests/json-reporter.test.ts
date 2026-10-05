import { describe, expect, it } from 'vitest'
import { createJsonReport, formatJsonReport, summarizeFindings } from '../packages/reporters/json.js'
import type { Finding } from '../packages/scanner-core/types.js'

const findings: Finding[] = [
  {
    ruleId: 'example/high',
    title: 'High finding',
    severity: 'high',
    file: 'a.ts',
    evidence: 'synthetic',
    remediation: 'Fix it.',
  },
  {
    ruleId: 'example/medium',
    title: 'Medium finding',
    severity: 'medium',
    file: 'b.ts',
    evidence: 'synthetic',
    remediation: 'Fix it.',
  },
]

describe('JSON reporter', () => {
  it('summarizes all severities', () => {
    expect(summarizeFindings(findings)).toEqual({
      critical: 0,
      high: 1,
      medium: 1,
      low: 0,
      info: 0,
      total: 2,
    })
  })

  it('emits versioned machine-readable JSON', () => {
    const report = createJsonReport(findings)
    expect(report.schemaVersion).toBe(1)
    expect(JSON.parse(formatJsonReport(findings))).toEqual(report)
  })
})
