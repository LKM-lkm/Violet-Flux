import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    // Get the path parameter - it's already an array of path segments
    const pathParam = event.context.params?.path
    
    // Join the path segments
    let relativePath = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || '')
    
    // Decode URI - handle both encoded and non-encoded paths
    try {
      relativePath = decodeURIComponent(relativePath)
    } catch (e) {
      console.error('Failed to decode path:', relativePath, e)
    }
    
    // Normalize path - replace emoji folder names with actual folder names
    const pathMappings: Record<string, string> = {
      '📔我的': 'Mine',
      '☁CloudFlare': '☁CloudFlare',
      '⬇️资源下载': '⬇️资源下载',
      '𝄞Sibelius': '𝄞Sibelius',
      '🌐网络技巧': '🌐网络技巧'
    }
    
    // Apply all path mappings
    let normalizedPath = relativePath
    for (const [emoji, actual] of Object.entries(pathMappings)) {
      normalizedPath = normalizedPath.replace(emoji, actual)
    }
    
    // Remove duplicate 'blog' and 'content' segments that might appear in malformed routes
    const segments = normalizedPath.split('/').filter(s => s && s !== 'blog' && s !== 'content')
    normalizedPath = segments.join('/')
    
    // Try multiple possible paths
    const possiblePaths = [
      // Try with normalized path
      join(process.cwd(), 'content', 'blog', normalizedPath),
      // Try with original path
      join(process.cwd(), 'content', 'blog', relativePath),
      // Try with 笔记/Mine prefix if not already present
      !normalizedPath.includes('笔记') ? join(process.cwd(), 'content', 'blog', '笔记', 'Mine', normalizedPath) : null,
    ].filter(Boolean) as string[]
    
    let filePath = ''
    let found = false
    
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        filePath = path
        found = true
        break
      }
    }
    
    // Debug log
    console.log('Blog Assets Route:', {
      pathParam,
      relativePath,
      normalizedPath,
      possiblePaths,
      filePath,
      found
    })
    
    // Check if file exists
    if (!found) {
      console.log('File not found in any of the possible paths')
      throw createError({
        statusCode: 404,
        statusMessage: `File not found: ${relativePath}`
      })
    }
    
    // Read the file
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
    
    // Set headers
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=604800')
    
    console.log('✓ Serving file:', filePath, 'as', contentType)
    
    return fileBuffer
  } catch (error) {
    console.error('Blog Assets Route Error:', error)
    throw error
  }
})
