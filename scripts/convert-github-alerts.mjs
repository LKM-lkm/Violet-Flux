#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'

const alertStyles = {
  NOTE: ['info', 'i-lucide-info'],
  TIP: ['success', 'i-lucide-lightbulb'],
  IMPORTANT: ['primary', 'i-lucide-star'],
  WARNING: ['warning', 'i-lucide-alert-triangle'],
  CAUTION: ['error', 'i-lucide-alert-circle'],
}

export function convertAlerts(markdown) {
  const newline = markdown.includes('\r\n') ? '\r\n' : '\n'
  const lines = markdown.split(/\r?\n/)
  const output = []
  let frontmatter = lines[0]?.trim() === '---'
  let fence = null
  let conversions = 0

  for (let index = 0; index < lines.length;) {
    const line = lines[index]
    if (frontmatter) {
      output.push(line)
      if (line.trim() === '---' && index > 0) frontmatter = false
      index++
      continue
    }

    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fence) {
      output.push(line)
      const closing = line.match(/^ {0,3}(`+|~+)[ \t]*$/)
      if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) fence = null
      index++
      continue
    }
    if (fenceMatch) {
      fence = { character: fenceMatch[1][0], length: fenceMatch[1].length }
      output.push(line)
      index++
      continue
    }

    const firstQuote = line.match(/^ {0,3}> ?(.*)$/)
    const alertMatch = firstQuote?.[1].match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i)
    if (!alertMatch) {
      output.push(line)
      index++
      continue
    }

    const type = alertMatch[1].toUpperCase()
    const [color, icon] = alertStyles[type]
    const quotedLines = [alertMatch[2]]
    let end = index + 1
    while (end < lines.length) {
      const quote = lines[end].match(/^ {0,3}> ?(.*)$/)
      if (!quote) break
      quotedLines.push(quote[1])
      end++
    }

    output.push(`::callout{icon="${icon}" color="${color}"}`)
    output.push(...quotedLines)
    output.push('::')
    conversions++
    index = end
  }

  return { content: output.join(newline), conversions }
}

function run() {
  const files = globSync('content/**/*.md', { ignore: ['**/node_modules/**'] })
  let changedFiles = 0
  let totalConversions = 0
  let failed = false

  for (const file of files) {
    try {
      const original = readFileSync(file, 'utf8')
      const result = convertAlerts(original)
      if (result.content === original) continue

      writeFileSync(file, result.content, 'utf8')
      changedFiles++
      totalConversions += result.conversions
      console.log(`Updated ${file}: ${result.conversions} alert(s)`)
    } catch (error) {
      failed = true
      console.error(`Failed to convert ${file}:`, error)
    }
  }

  console.log(`Alert conversion complete: ${changedFiles} file(s), ${totalConversions} alert(s).`)
  if (failed) process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run()
}
