#!/usr/bin/env node

/**
 * 将转义的 LaTeX 语法转换为标准语法
 * 
 * 转换规则：
 * 1. $...$ → \(...\) (行内公式)
 * 2. 移除花括号转义：\{ → {, \} → }
 * 3. 保留 $$...$$ (块级公式)
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import { join } from 'path'

console.log('🔄 开始转换 LaTeX 语法...\n')

// 查找所有 Markdown 文件
const files = glob.sync('content/**/*.md', {
  ignore: ['**/node_modules/**']
})

let totalFiles = 0
let totalConversions = 0

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf-8')
    const originalContent = content
    let fileConversions = 0

    // 1. 转换行内公式：$...$ → \(...\)
    // 使用负向前瞻和负向后顾，避免匹配 $$...$$
    const inlineRegex = /(?<!\$)\$(?!\$)([^\$\n]+?)\$(?!\$)/g
    const inlineMatches = content.match(inlineRegex)
    if (inlineMatches) {
      content = content.replace(inlineRegex, (match, formula) => {
        fileConversions++
        return `\\(${formula}\\)`
      })
    }

    // 2. 移除花括号转义：\{ → {, \} → }
    const braceCount = (content.match(/\\\{/g) || []).length + (content.match(/\\\}/g) || []).length
    if (braceCount > 0) {
      content = content.replace(/\\\{/g, '{')
      content = content.replace(/\\\}/g, '}')
      fileConversions += braceCount
    }

    // 3. 移除下划线转义（如果有）：\_ → _
    const underscoreCount = (content.match(/\\_/g) || []).length
    if (underscoreCount > 0) {
      // 只在数学公式中移除转义
      // 这个比较复杂，暂时跳过，因为 \_ 在 Markdown 中可能是有意的
    }

    // 如果内容有变化，写回文件
    if (content !== originalContent) {
      writeFileSync(file, content, 'utf-8')
      totalFiles++
      totalConversions += fileConversions
      console.log(`✓ ${file}`)
      console.log(`  转换了 ${fileConversions} 处`)
    }
  } catch (error) {
    console.error(`✗ 处理文件失败: ${file}`)
    console.error(`  错误: ${error.message}`)
  }
})

console.log('\n' + '='.repeat(50))
console.log(`✅ 转换完成！`)
console.log(`📁 处理了 ${totalFiles} 个文件`)
console.log(`🔧 总共转换了 ${totalConversions} 处`)
console.log('='.repeat(50))

if (totalFiles > 0) {
  console.log('\n💡 提示：')
  console.log('1. 请检查转换后的文件，确保公式显示正常')
  console.log('2. 建议使用 git diff 查看具体变化')
  console.log('3. 如果有问题，可以使用 git checkout 恢复')
  console.log('\n📝 下一步：')
  console.log('1. 更新 nuxt.config.ts 中的 MathJax 配置（如果需要）')
  console.log('2. 删除旧的转义脚本：')
  console.log('   - scripts/escape-latex-braces.mjs')
  console.log('   - .kiro/hooks/auto-fix-latex.kiro.hook')
  console.log('3. 运行 npm run dev 测试效果')
}
