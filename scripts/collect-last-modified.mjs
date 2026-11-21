import { readFileSync, readdirSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// 把每篇 md 文件在本地的真实修改时间（mtime）固化进 frontmatter 的 lastModified 字段。
// 云端 CI checkout 后所有文件 mtime 会变成构建时间，所以必须在本地把时间写进内容，
// 让它随 git 一起走。构建时 hook 只读 frontmatter，不再碰文件系统 mtime。
//
// 用法：npm run collect-dates
// 幂等：写入后恢复原 mtime，因此重复运行结果相同；只改 lastModified 一行，其余原样保留。

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const blogDir = join(projectRoot, 'content', 'blog')

// 与 content.config.ts 的 exclude 保持一致
const EXCLUDED_DIRS = new Set(['node_modules', 'assets', '.obsidian'])

const mdFiles = []

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue
      walk(fullPath)
    } else if (/\.md$/i.test(entry.name)) {
      mdFiles.push(fullPath)
    }
  }
}

function withLastModified(body, iso) {
  const eol = body.includes('\r\n') ? '\r\n' : '\n'
  const field = `lastModified: "${iso}"`
  const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/)

  if (frontmatter) {
    const yaml = frontmatter[1]
      .split(/\r?\n/)
      .filter(line => !/^lastModified:/.test(line))
      .join(eol)
      .trimEnd()
    const block = `---${eol}${yaml ? yaml + eol : ''}${field}${eol}---`
    return body.replace(frontmatter[0], block)
  }

  return `---${eol}${field}${eol}---${eol}${body}`
}

walk(blogDir)

let updated = 0
let unchanged = 0

for (const file of mdFiles) {
  const stat = statSync(file)
  const iso = stat.mtime.toISOString()
  const body = readFileSync(file, 'utf8')
  const next = withLastModified(body, iso)

  if (next === body) {
    unchanged++
    continue
  }

  writeFileSync(file, next, 'utf8')
  // 写文件会把 mtime 改成“现在”，恢复原值才能让脚本幂等，
  // 也避免下次收集把“运行脚本的时间”误当成文章修改时间。
  utimesSync(file, stat.atime, stat.mtime)
  updated++
  console.log(`updated  ${relative(projectRoot, file)}  ->  ${iso}`)
}

console.log(`\nDone. ${mdFiles.length} files scanned, ${updated} updated, ${unchanged} unchanged.`)
