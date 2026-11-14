#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'

const imageExtensions = /\.(?:avif|bmp|gif|jpe?g|png|svg|tiff?|webp)$/i
const inlineCode = /(`+)[\s\S]*?\1/g

function encodePath(path) {
  return path.split('/').map((segment) => {
    try {
      return encodeURIComponent(decodeURIComponent(segment))
    } catch {
      return encodeURIComponent(segment)
    }
  }).join('/')
}

export function convertObsidianImages(markdown) {
  const newline = markdown.includes('\r\n') ? '\r\n' : '\n'
  const lines = markdown.split(/\r?\n/)
  const output = []
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

    const codeSpans = []
    const protectedLine = line.replace(inlineCode, (code) => {
      const index = codeSpans.push(code) - 1
      return `\u0000${index}\u0000`
    })
    const convertedLine = protectedLine.replace(/!\[\[([^\]\n]+)\]\]/g, (embed, target) => {
      const separator = target.indexOf('|')
      const rawPath = (separator < 0 ? target : target.slice(0, separator)).trim()
      if (!imageExtensions.test(rawPath)) return embed

      const suffix = separator < 0 ? '' : target.slice(separator + 1).trim()
      const isSize = /^\d+(?:x\d+)?$/.test(suffix)
      const alt = suffix && !isSize
        ? suffix
        : /^\d+$/.test(suffix)
          ? suffix
          : rawPath.split('/').pop()
      const relativePath = rawPath.includes('/') || rawPath.startsWith('/')
        ? rawPath
        : `assets/${rawPath}`
      const escapedAlt = alt.replace(/\\/g, '\\\\').replace(/\]/g, '\\]')
      conversions++
      return `![${escapedAlt}](${encodePath(relativePath)})`
    })

    output.push(convertedLine.replace(/\u0000(\d+)\u0000/g, (_match, index) => codeSpans[Number(index)]))
  }

  return { content: output.join(newline), conversions }
}

function run() {
  const files = globSync('content/blog/**/*.md', { ignore: ['**/node_modules/**'] })
  let changedFiles = 0
  let totalConversions = 0
  let failed = false

  for (const file of files) {
    try {
      const original = readFileSync(file, 'utf8')
      const result = convertObsidianImages(original)
      if (result.content === original) continue

      writeFileSync(file, result.content, 'utf8')
      changedFiles++
      totalConversions += result.conversions
      console.log(`Updated ${file}: ${result.conversions} image embed(s)`)
    } catch (error) {
      failed = true
      console.error(`Failed to convert ${file}:`, error)
    }
  }

  console.log(`Image conversion complete: ${changedFiles} file(s), ${totalConversions} image embed(s).`)
  if (failed) process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run()
}
