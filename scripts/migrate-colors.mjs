import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

console.log('🎨 开始迁移颜色变量...\n')

const files = glob.sync('app/**/*.vue')

// 颜色映射表
const colorMap = {
  // 旧变量 → 新变量
  'var(--bg)': 'var(--bg-primary)',
  'var(--text)': 'var(--text-primary)',
  'var(--text-muted)': 'var(--text-secondary)',
  'var(--border)': 'var(--border-light)',
  'var(--secondary)': 'var(--bg-secondary)',
  'var(--card-shadow)': 'var(--shadow-xl)',
  
  // 硬编码颜色 → 变量
  'rgba(128, 128, 128, 0.05)': 'var(--bg-secondary)',
  'rgba(128, 128, 128, 0.03)': 'var(--bg-secondary)',
  'rgba(128, 128, 128, 0.08)': 'var(--bg-tertiary)',
  'rgba(128, 128, 128, 0.1)': 'var(--border-medium)',
  'rgba(128, 128, 128, 0.1)': 'var(--border-light)',
  'rgba(255, 255, 255, 0.03)': 'var(--glass-bg)',
  'rgba(255, 255, 255, 0.05)': 'var(--glass-bg)',
  'rgba(255, 255, 255, 0.2)': 'var(--glass-border)',
  'rgba(0, 0, 0, 0.05)': 'var(--bg-secondary)',
  'rgba(0, 0, 0, 0.1)': 'var(--shadow-sm)',
  'rgba(0, 0, 0, 0.15)': 'var(--shadow-md)',
  'rgba(0, 0, 0, 0.2)': 'var(--shadow-lg)',
  'rgba(0, 0, 0, 0.6)': 'var(--shadow-2xl)',
  '#ffffff': 'var(--bg-primary)',
  '#fff': 'var(--bg-primary)',
  '#ef4444': 'var(--primary)',
}

let totalReplacements = 0

files.forEach(file => {
  let content = readFileSync(file, 'utf-8')
  let fileReplacements = 0
  
  Object.entries(colorMap).forEach(([oldColor, newVar]) => {
    const regex = new RegExp(oldColor.replace(/[()]/g, '\\$&'), 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, newVar)
      fileReplacements += matches.length
    }
  })
  
  if (fileReplacements > 0) {
    writeFileSync(file, content)
    console.log(`✅ ${file}: 替换了 ${fileReplacements} 处`)
    totalReplacements += fileReplacements
  }
})

console.log(`\n🎉 完成！共替换 ${totalReplacements} 处颜色值`)
console.log('\n💡 提示：请检查替换结果，确保样式正常')
