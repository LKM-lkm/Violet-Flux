/**
 * 从 Nuxt Content v3 的正文语法树中提取纯文本。
 *
 * `queryCollection()` 返回的 `article.body` 是 Minimark 树，不是 MDC/HAST 树：
 *
 *   { type: 'minimark', value: [ node, node, ... ] }
 *
 * 其中文本节点是**裸字符串**，元素节点是**元组数组** `[tag, props, ...children]`。
 * 也就是说 Minimark 树上既没有 `node.type === 'text'`，也没有 `node.children`
 * （正文在 `node.value` 里），直接按 HAST 的形状遍历会什么都取不到。
 * 参考 node_modules/minimark/dist/index.d.mts 与 dist/hast.mjs。
 *
 * 这里同时也兼容 MDC/HAST 的 `{ type: 'text', value }` / `{ children: [] }` 形态，
 * 以便数据结构变化或传入未压缩的树时仍然可用。
 */

// 只跳过块级代码：行内 code 常常是标识符或 LaTeX 定界符，属于正文信息
const DEFAULT_SKIP_TAGS = ['pre', 'script', 'style']
const DEFAULT_MAX_LENGTH = 3000

// 块级元素之间插入换行；行内元素直接拼接，避免把 `italic` + `.` 拼成 `italic .`
const BLOCK_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'div', 'section', 'article', 'aside', 'header', 'footer', 'main',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
  'figure', 'figcaption', 'hr', 'pre'
])

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isSkipped(tag, skipTags) {
  return typeof tag === 'string' && tag !== '' && skipTags.has(tag)
}

function collect(node, out, skipTags) {
  if (node === null || node === undefined) return

  if (typeof node === 'string') {
    if (node) out.push(node)
    return
  }

  if (typeof node === 'number' || typeof node === 'boolean') {
    out.push(String(node))
    return
  }

  // Minimark 元素：[tag, props, ...children]
  if (Array.isArray(node)) {
    const tag = typeof node[0] === 'string' ? node[0] : ''

    if (tag === '') {
      // 不是 [tag, props, ...children]，而是一个裸的节点数组
      for (const child of node) collect(child, out, skipTags)
      return
    }

    if (isSkipped(tag, skipTags)) return

    const block = BLOCK_TAGS.has(tag)
    if (block) out.push('\n')

    // 标准排布是 [tag, props, ...children]；props 缺失时退化为 [tag, ...children]
    const start = node.length > 1 && isPlainObject(node[1]) ? 2 : 1
    for (let i = start; i < node.length; i++) collect(node[i], out, skipTags)

    if (block) out.push('\n')
    return
  }

  if (typeof node === 'object') {
    const tag = typeof node.tag === 'string'
      ? node.tag
      : (typeof node.name === 'string' ? node.name : '')
    if (isSkipped(tag, skipTags)) return

    const block = BLOCK_TAGS.has(tag)
    if (block) out.push('\n')

    if (typeof node.value === 'string') {
      // MDC/HAST 文本节点
      if (node.value) out.push(node.value)
    } else if (Array.isArray(node.value)) {
      // Minimark / Minimal 树的根：{ type: 'minimark', value: [...] }
      for (const child of node.value) collect(child, out, skipTags)
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) collect(child, out, skipTags)
    }

    if (block) out.push('\n')
  }
}

/**
 * 把正文语法树压平成一段纯文本（用于喂给 AI）。
 *
 * @param {unknown} tree Nuxt Content 的 `article.body`，或它的 JSON 解析结果
 * @param {{ maxLength?: number, skipTags?: string[] }} [options]
 * @returns {string}
 */
export function extractPlainText(tree, options = {}) {
  const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH
  const skipTags = new Set(options.skipTags ?? DEFAULT_SKIP_TAGS)

  const out = []
  collect(tree, out, skipTags)

  return out.join('')
    .replace(/[^\S\n]+/g, ' ')   // 压缩空格/制表符，保留换行
    .replace(/ *\n */g, '\n')    // 去掉换行两侧的空格
    .replace(/\n{2,}/g, '\n')    // 合并连续空行
    .trim()
    .slice(0, maxLength)
}
