// 临时：把 content 数据库 dump 灌进内存 SQLite，正经查 path 列
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { DatabaseSync } from 'node:sqlite'

const src = readFileSync('.nuxt/content/database.compressed.mjs', 'utf8')
const sql = gunzipSync(Buffer.from(src.match(/"([A-Za-z0-9+/=]+)"/)[1], 'base64')).toString('utf8')

console.log('=== dump 结构预览 ===')
console.log(sql.slice(0, 400).replace(/\n/g, ' '))
console.log('...')
console.log('CREATE TABLE 语句数:', (sql.match(/CREATE TABLE/gi) || []).length)

const db = new DatabaseSync(':memory:')
const statements = JSON.parse(sql)
console.log('语句数:', statements.length)
let ok = 0
for (const s of statements) {
  if (!s.trim()) continue
  try { db.exec(s.endsWith(';') ? s : s + ';'); ok++ } catch (e) { console.log('  失败:', e.message, '|', s.slice(0, 80)) }
}
console.log(`执行成功: ${ok}/${statements.length}`)

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
console.log('\n表:', tables.map(t => t.name).join(', '))

const cols = db.prepare("PRAGMA table_info(_content_content)").all().map(c => c.name)
console.log('_content_content 列:', cols.join(', '))

const rows = db.prepare('SELECT id, title, path, stem FROM _content_content ORDER BY path').all()
console.log('\n=== 项目文档 相关 item ===')
for (const r of rows) {
  if (!r.id.includes('项目文档')) continue
  console.log(`  id   = ${r.id}`)
  console.log(`  path = ${JSON.stringify(r.path)}  stem=${JSON.stringify(r.stem)}  title=${JSON.stringify(r.title)}`)
}
