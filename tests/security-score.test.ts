import { describe, expect, it } from 'vitest'
import { calculateSecurityScore, securityScoreLabel } from '../packages/reporters/security-score.js'
import type { Finding, Severity } from '../packages/scanner-core/types.js'

function finding(severity: Severity): Finding {
  return {
    ruleId: `test/${severity}`,
    title: 'Synthetic finding',
    severity,
    file: 'fixture.ts',
    evidence: 'synthetic',
    remediation: 'Synthetic remediation.',
  }
}

describe('security score', () => {
  it('starts at 100 for a clean scan', () => {
    expect(calculateSecurityScore([])).toBe(100)
    expect(securityScoreLabel(100)).toBe('Strong')
  })

  it('applies deterministic severity penalties', () => {
    expect(calculateSecurityScore([finding('critical'), finding('medium')])).toBe(60)
    expect(securityScoreLabel(60)).toBe('Needs attention')
  })

  it('never returns a negative score', () => {
    expect(calculateSecurityScore(Array.from({ length: 10 }, () => finding('critical')))).toBe(0)
  })
})
