/**
 * AI Summary 代理接口
 * 解决浏览器直接调用 Cloudflare Worker 时的 CORS 问题
 * 客户端调用 /api/ai-summary (同源)，服务端转发到 Worker
 */
const WORKER_URL = 'https://violet-flux-summery.likem.cc.cd'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body?.content) {
      throw createError({ statusCode: 400, message: 'Missing content field' })
    }

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: body.content })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Worker error:', response.status, errorText)
      throw createError({
        statusCode: response.status,
        message: `Worker returned ${response.status}`
      })
    }

    const data = await response.json()
    return data
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('AI Summary proxy error:', err)
    throw createError({
      statusCode: 502,
      message: err.message || 'Failed to fetch AI summary'
    })
  }
})
