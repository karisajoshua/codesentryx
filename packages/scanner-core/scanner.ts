import type { Finding, Rule, ScanContext, SourceFile } from './types.js'

export class Scanner {
  constructor(private readonly rules: readonly Rule[]) {}

  scan(files: readonly SourceFile[]): readonly Finding[] {
    const context: ScanContext = { files }
    return this.rules.flatMap((rule) => rule.scan(context))
  }
}
