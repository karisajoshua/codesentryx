#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'
import { Scanner } from '../../packages/scanner-core/scanner.js'
import type { SourceFile } from '../../packages/scanner-core/types.js'
import { wildcardCorsRule } from '../../packages/rules/wildcard-cors.js'

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
  const [, , command, target = '.'] = process.argv

  if (command !== 'scan') {
    console.error('Usage: codesentryx scan [directory]')
    process.exitCode = 1
    return
  }

  const root = resolve(target)
  const files = await loadFiles(root)
  const findings = new Scanner([wildcardCorsRule]).scan(files)

  if (findings.length === 0) {
    console.log('CodeSentryX: no findings.')
    return
  }

  for (const finding of findings) {
    const location = finding.line ? `${finding.file}:${finding.line}` : finding.file
    console.log(`[${finding.severity.toUpperCase()}] ${finding.ruleId} — ${location}`)
    console.log(`  ${finding.title}`)
    console.log(`  Remediation: ${finding.remediation}`)
  }

  process.exitCode = findings.some((finding) => finding.severity === 'critical' || finding.severity === 'high') ? 2 : 0
}

void main()
