import { describe, expect, it } from 'vitest'
import { createSarifReport, formatSarifReport } from '../packages/reporters/sarif.js'
import type { Finding } from '../packages/scanner-core/types.js'

const finding: Finding = {
  ruleId: 'web/wildcard-cors',
  title: 'Wildcard CORS origin detected',
  severity: 'medium',
  file: 'src/server.ts',
  line: 12,
  evidence: "origin: '*'",
  remediation: 'Restrict CORS to trusted origins.',
}

describe('SARIF reporter', () => {
  it('creates SARIF 2.1.0 with rules and source locations', () => {
    const report = createSarifReport([finding])
    const run = report.runs[0]

    expect(report.version).toBe('2.1.0')
    expect(run?.tool.driver.name).toBe('CodeSentryX')
    expect(run?.tool.driver.rules).toHaveLength(1)
    expect(run?.results[0]).toMatchObject({
      ruleId: 'web/wildcard-cors',
      level: 'warning',
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri: 'src/server.ts' },
            region: { startLine: 12 },
          },
        },
      ],
    })
  })

  it('deduplicates rule descriptors', () => {
    const report = createSarifReport([finding, { ...finding, line: 20 }])
    expect(report.runs[0]?.tool.driver.rules).toHaveLength(1)
    expect(report.runs[0]?.results).toHaveLength(2)
  })

  it('emits valid JSON for an empty scan', () => {
    const report = JSON.parse(formatSarifReport([]))
    expect(report.runs[0].results).toEqual([])
  })
})
