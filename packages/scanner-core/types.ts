export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical'

export interface SourceFile {
  path: string
  content: string
}

export interface Finding {
  ruleId: string
  title: string
  severity: Severity
  file: string
  line?: number
  evidence: string
  remediation: string
}

export interface ScanContext {
  files: readonly SourceFile[]
}

export interface Rule {
  id: string
  description: string
  severity: Severity
  scan(context: ScanContext): readonly Finding[]
}
