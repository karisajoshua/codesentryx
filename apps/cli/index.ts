#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'
import { formatJsonReport } from '../../packages/reporters/json.js'
import { Scanner } from '../../packages/scanner-core/scanner.js'
import type { SourceFile } from '../../packages/scanner-core/types.js'
import { supabaseServiceRoleClientRule, wildcardCorsRule } from '../../packages/rules/index.js'

const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'coverage'])
const textExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.env'])
const maxFileBytes = 512 * 1024

async function loadFiles(root: string, directory = root): Promise<SourceFile[]> {
  const files: SourceFile[] = []

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue

    const absolutePath = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await loadFiles(root, absolutePath)))
      continue
    }

    if (!entry.isFile() || (!textExtensions.has(extname(entry.name)) && !entry.name.startsWith('.env'))) continue

    const metadata = await stat(absolutePath)
    if (metadata.size > maxFileBytes) continue

    files.push({
      path: relative(root, absolutePath),
      content: await readFile(absolutePath, 'utf8'),
    })
  }

  return files
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const command = args[0]
  const json = args.includes('--json')
  const target = args.find((arg, index) => index > 0 && !arg.startsWith('--')) ?? '.'

  if (command !== 'scan') {
    console.error('Usage: codesentryx scan [directory] [--json]')
    process.exitCode = 1
    return
  }

  const root = resolve(target)
  const files = await loadFiles(root)
  const findings = new Scanner([wildcardCorsRule, supabaseServiceRoleClientRule]).scan(files)

  if (json) {
    console.log(formatJsonReport(findings))
  } else if (findings.length === 0) {
    console.log('CodeSentryX: no findings.')
  } else {
    for (const finding of findings) {
      const location = finding.line ? `${finding.file}:${finding.line}` : finding.file
      console.log(`[${finding.severity.toUpperCase()}] ${finding.ruleId} — ${location}`)
      console.log(`  ${finding.title}`)
      console.log(`  Remediation: ${finding.remediation}`)
    }
  }

  process.exitCode = findings.some((finding) => finding.severity === 'critical' || finding.severity === 'high') ? 2 : 0
}

void main()
