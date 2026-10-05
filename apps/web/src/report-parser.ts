import type { Finding, Severity } from '../../../packages/scanner-core/types'

const severities = new Set<Severity>(['critical', 'high', 'medium', 'low', 'info'])

function isFinding(value: unknown): value is Finding {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.ruleId === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.severity === 'string' &&
    severities.has(candidate.severity as Severity) &&
    typeof candidate.file === 'string' &&
    (candidate.line === undefined || typeof candidate.line === 'number') &&
    typeof candidate.evidence === 'string' &&
    typeof candidate.remediation === 'string'
  )
}

export function parseScanReport(value: unknown): readonly Finding[] {
  if (!value || typeof value !== 'object') throw new Error('Report must be a JSON object.')

  const report = value as Record<string, unknown>
  if (report.schemaVersion !== 1) throw new Error('Unsupported CodeSentryX report schema.')
  if (!Array.isArray(report.findings) || !report.findings.every(isFinding)) {
    throw new Error('Report contains invalid findings.')
  }

  return report.findings
}
