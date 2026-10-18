#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'

const inlineMath = /(?<!\$)\$(?!\$)([^\$\n]+?)\$(?!\$)/g
const inlineCode = /(`+)[\s\S]*?\1/g

export function convertMarkdown(content) {
  const newline = content.includes('\r\n') ? '\r\n' : '\n'
  const lines = content.split(/\r?\n/)
  const output = []
  const codeSpans = []
  let inFrontmatter = lines[0]?.trim() === '---'
  let fence = null
  let conversions = 0

  for (const line of lines) {
    if (inFrontmatter) {
      output.push(line)
      if (line.trim() === '---' && output.length > 1) inFrontmatter = false
      continue
    }

    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fence) {
      output.push(line)
      const closing = line.match(/^ {0,3}(`+|~+)[ \t]*$/)
      if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) {
        fence = null
      }
      continue
    }
    if (fenceMatch) {
      fence = { character: fenceMatch[1][0], length: fenceMatch[1].length }
      output.push(line)
      continue
    }

    codeSpans.length = 0
    const protectedLine = line.replace(inlineCode, (code) => {
      const index = codeSpans.push(code) - 1
      return `\u0000${index}\u0000`
    })
    const convertedLine = protectedLine.replace(inlineMath, (_match, formula) => {
      conversions++
      return `\\\\(${formula}\\\\)`
    })
    output.push(convertedLine.replace(/\u0000(\d+)\u0000/g, (_match, index) => codeSpans[Number(index)]))
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
      const result = convertMarkdown(original)
      if (result.content === original) continue

      writeFileSync(file, result.content, 'utf8')
      changedFiles++
      totalConversions += result.conversions
      console.log(`Updated ${file}: ${result.conversions} inline formula(s)`)
    } catch (error) {
      failed = true
      console.error(`Failed to convert ${file}:`, error)
    }
  }

  console.log(`Math conversion complete: ${changedFiles} file(s), ${totalConversions} formula(s).`)
  if (failed) process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run()
}
