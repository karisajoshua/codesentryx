import type { Finding, Severity } from '../scanner-core/types.js'

export const reportSchemaVersion = 1

export interface JsonReport {
  schemaVersion: number
  summary: Record<Severity | 'total', number>
  findings: readonly Finding[]
}

export function summarizeFindings(findings: readonly Finding[]): Record<Severity | 'total', number> {
  const summary: Record<Severity | 'total', number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    total: findings.length,
  }

  for (const finding of findings) {
    summary[finding.severity] += 1
  }

  return summary
}

export function createJsonReport(findings: readonly Finding[]): JsonReport {
  return {
    schemaVersion: reportSchemaVersion,
    summary: summarizeFindings(findings),
    findings,
  }
}

export function formatJsonReport(findings: readonly Finding[]): string {
  return JSON.stringify(createJsonReport(findings), null, 2)
}
