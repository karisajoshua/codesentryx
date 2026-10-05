import type { Finding, Severity } from '../scanner-core/types.js'

const penalty: Record<Severity, number> = {
  critical: 30,
  high: 18,
  medium: 10,
  low: 4,
  info: 0,
}

export function calculateSecurityScore(findings: readonly Finding[]): number {
  const totalPenalty = findings.reduce((total, finding) => total + penalty[finding.severity], 0)
  return Math.max(0, 100 - totalPenalty)
}

export function securityScoreLabel(score: number): string {
  if (score >= 90) return 'Strong'
  if (score >= 75) return 'Good'
  if (score >= 50) return 'Needs attention'
  return 'High risk'
}
