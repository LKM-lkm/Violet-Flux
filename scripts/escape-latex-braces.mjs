import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

console.log('🔍 正在查找 Markdown 文件...')

const files = glob.sync('content/**/*.md')
console.log(`📝 找到 ${files.length} 个文件`)

let totalFixed = 0

files.forEach(file => {
  const original = readFileSync(file, 'utf-8')
  let content = original
  let fileFixed = 0
  
  // 转义 inline math 中的花括号 $...$
  content = content.replace(/\$([^\$\n]+)\$/g, (match, math) => {
    if (math.includes('{') || math.includes('}')) {
      fileFixed++
      // 避免重复转义：先移除已有的转义，再重新转义
      const unescaped = math.replace(/\\\{/g, '{').replace(/\\\}/g, '}')
      const escaped = unescaped.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
      return `$${escaped}$`
    }
    return match
  })
  
  // 转义 display math 中的花括号 $$...$$
  content = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    if (math.includes('{') || math.includes('}')) {
      fileFixed++
      const unescaped = math.replace(/\\\{/g, '{').replace(/\\\}/g, '}')
      const escaped = unescaped.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
      return `$$${escaped}$$`
    }
    return match
  })
  
  // 转义 LaTeX 块 \[...\] 中的花括号
  content = content.replace(/\\\[([\s\S]+?)\\\]/g, (match, math) => {
    if (math.includes('{') || math.includes('}')) {
      fileFixed++
      const unescaped = math.replace(/\\\{/g, '{').replace(/\\\}/g, '}')
      const escaped = unescaped.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
      return `\\[${escaped}\\]`
    }
    return match
  })
  
  if (content !== original) {
    writeFileSync(file, content)
    console.log(`✅ ${file}: 修复了 ${fileFixed} 处`)
    totalFixed += fileFixed
  }
})

console.log(`\n🎉 完成！共修复 ${totalFixed} 处 LaTeX 公式`)
