import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const imagePath = join(process.cwd(), 'content/blog/笔记/📔我的/⬇️资源下载/assets/Pasted image 20250702161703.png')
    const imageBuffer = await readFile(imagePath)
    
    event.node.res.setHeader('Content-Type', 'image/png')
    return imageBuffer
  } catch (error) {
    return {
      error: 'File not found',
      message: error.message
    }
  }
})
