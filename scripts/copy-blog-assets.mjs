import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

const sourceDir = join(projectRoot, 'content', 'blog')
const targetDir = join(projectRoot, 'public', '_blog_assets')

// 递归复制图片文件
function copyImages(src, dest) {
  if (!existsSync(src)) return
  
  const entries = readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const relativePath = srcPath.replace(sourceDir, '').replace(/\\/g, '/')
    const destPath = join(targetDir, relativePath)
    
    if (entry.isDirectory()) {
      copyImages(srcPath, destPath)
    } else if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(entry.name)) {
      // 确保目标目录存在
      mkdirSync(dirname(destPath), { recursive: true })
      copyFileSync(srcPath, destPath)
      console.log(`Copied: ${relativePath}`)
    }
  }
}

console.log('Copying blog assets...')
copyImages(sourceDir, targetDir)
console.log('Done!')
