import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''
  
  // Only handle /_blog_assets requests
  if (!url.startsWith('/_blog_assets')) {
    return
  }
  
  try {
    // Remove /_blog_assets prefix and decode URI
    const relativePath = decodeURIComponent(url.replace('/_blog_assets/', ''))
    const filePath = join(process.cwd(), 'content/blog', relativePath)
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return
    }
    
    // Read and serve the file
    const fileBuffer = await readFile(filePath)
    
    // Set appropriate content type based on extension
    const ext = relativePath.split('.').pop()?.toLowerCase()
    const contentTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp',
      'pdf': 'application/pdf'
    }
    
    const contentType = contentTypes[ext || ''] || 'application/octet-stream'
    event.node.res.setHeader('Content-Type', contentType)
    event.node.res.setHeader('Cache-Control', 'public, max-age=604800')
    
    return fileBuffer
  } catch (error) {
    // Let other handlers deal with it
    return
  }
})
