import { describe, expect, it } from 'vitest'
import { parseScanReport } from '../apps/web/src/report-parser'

describe('parseScanReport', () => {
  it('accepts a valid CodeSentryX v1 report', () => {
    const findings = parseScanReport({
      schemaVersion: 1,
      findings: [
        {
          ruleId: 'web/wildcard-cors',
          title: 'Wildcard CORS origin detected',
          severity: 'medium',
          file: 'server.ts',
          line: 2,
          evidence: "origin: '*'",
          remediation: 'Restrict origins.',
        },
      ],
    })
    expect(findings).toHaveLength(1)
  })

  it('rejects unsupported schemas', () => {
    expect(() => parseScanReport({ schemaVersion: 99, findings: [] })).toThrow(/Unsupported/)
  })

  it('rejects malformed findings', () => {
    expect(() => parseScanReport({ schemaVersion: 1, findings: [{ severity: 'critical' }] })).toThrow(/invalid/)
  })
})
