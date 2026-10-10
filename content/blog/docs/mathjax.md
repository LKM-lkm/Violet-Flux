---
title: MathJax 数学公式
description: MathJax v4 的接入方式、可用定界符与语法、旧语法迁移和排查清单
tags: [文档, MathJax]
---

# MathJax 数学公式

Violet Flux 通过 CDN 加载 MathJax v4，在 `nuxt.config.ts` 的 `app.head.script` 中注入全局配置，再由客户端插件在页面挂载后手动触发排版；`package.json` 里没有 MathJax 依赖。

## 当前配置

| 项目 | 值 |
| --- | --- |
| 脚本地址 | `https://cdn.jsdelivr.net/npm/mathjax@4.1.1/tex-mml-chtml.js`（`async`，id 为 `MathJax-script`） |
| 引入方式 | CDN，不是 npm 依赖 |
| 自动排版 | 关闭（`startup.typeset: false`），由插件调用 |

`nuxt.config.ts` 中注入的配置：

```ts
window.MathJax = {
  loader: { load: ['[tex]/ams', '[tex]/newcommand', '[tex]/configmacros'] },
  tex: {
    packages: ['base', 'ams', 'newcommand', 'configmacros'],
    // 定界符
    inlineMath: [['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    // 处理选项
    processEscapes: true,       // \$ 表示字面量美元符号
    processEnvironments: true,  // 处理 \begin{xxx}...\end{xxx}
    processRefs: true,          // 处理 \ref{...} 引用
    // 标签和编号
    tags: 'none',
    tagSide: 'right',
    tagIndent: '0.8em',
    useLabelIds: true,
    // 样式与性能限制
    mathStyle: 'TeX',
    maxBuffer: 5 * 1024,
    maxTemplateSubtitutions: 10000,
    // 错误处理
    formatError: (jax, err) => jax.formatError(err)
  },
  output: { font: 'mathjax-termes' },
  startup: { typeset: false }
}
```

| 配置项 | 取值与作用 |
| --- | --- |
| `loader.load` / `tex.packages` | 加载 `ams`、`newcommand`、`configmacros` 扩展 |
| `tex.inlineMath` | 行内定界符 `\(...\)` |
| `tex.displayMath` | 块级定界符 `$$...$$`、`\[...\]` |
| `tex.processEscapes` | 允许 `\$`、`\\` 等转义 |
| `tex.processEnvironments` | 支持 `\begin{...}...\end{...}` 环境 |
| `tex.processRefs` | 支持 `\ref` / `\eqref` |
| `tex.tags` | `'none'`：公式不自动编号（可改 `'ams'`、`'all'`） |
| `tex.tagSide` / `tex.tagIndent` / `tex.useLabelIds` | 编号标签靠右、缩进 `0.8em`、用标签名作为 id |
| `tex.mathStyle` | `TeX` 排版风格 |
| `tex.maxBuffer` / `tex.maxTemplateSubtitutions` | 单个公式的规模上限（5K / 10000 次） |
| `tex.formatError` | 使用 MathJax 默认的错误格式化 |
| `output.font` | 输出字体 `mathjax-termes` |
| `startup.typeset` | `false`，MathJax 不自动排版 |

Nuxt 配置将这段初始化代码放在模板字符串中，因此配置源码里的 `\\(` 会生成浏览器实际需要的 `\(`。不要在这里再多加一层反斜杠，否则 MathJax 会等待错误的定界符。

## 渲染时机

| 位置 | 行为 |
| --- | --- |
| `app/plugins/mathjax.client.ts` | 每 100ms 等待 `window.MathJax.typesetPromise` 可用，最多 10 秒；调用 `typesetPromise()`；成功打印 `MathJax rendered successfully`，失败打印 `MathJax rendering error:` |
| 插件初始化 | 立即渲染一次 |
| 路由变化 | `router.afterEach` 之后延迟 500ms 重新渲染 |
| `app/pages/blog/[...slug].vue` | `onMounted` 中 `nextTick` 调用一次，1000ms 后再调用一次 |

插件通过 `provide` 暴露 `$renderMathJax`。正常写文章不需要手动调用；运行时动态插入的公式可以再调一次：

```ts
useNuxtApp().$renderMathJax?.()
```

## 支持的语法

### 先看 Markdown 转义（重要）

Nuxt Content 用 MDC 解析 Markdown，`\(`、`\[` 中的反斜杠会被当作转义符处理，渲染出的 DOM 里只剩 `(`、`[`，MathJax 就拿不到定界符。实际解析与页面产物的结果：

| 源文件写法 | 交给 MathJax 的文本 | 结果 |
| --- | --- | --- |
| `\(x^2\)` | `(x^2)` | ❌ 不渲染 |
| `\\(x^2\\)` | `\(x^2\)` | ✅ 行内公式 |
| `\[ ... \]` | `[ ... ]` | ❌ 不渲染 |
| `\\[ ... \\]` | 被 MDC 当作方括号语法拆散 | ❌ 不渲染 |
| `$$ ... $$` | `$$ ... $$` | ✅ 块级公式 |

结论：

- **块级公式统一用 `$$...$$`**，独占行书写。
- **行内公式在源文件里写双反斜杠 `\\(...\\)`**。
- 配置里虽然有 `\[...\]`，但它在 Markdown 中无法原样保留，不要使用。

### MDC 与下标花括号

MDC 会把部分 `_{...}` 误当成组件属性并删除。项目会在解析前暂时保护简单字母数字下标，并在解析后恢复，因此以下写法能原样交给 MathJax：

| 写法 | 交给 MathJax 的文本 | 说明 |
| --- | --- | --- |
| `\\(a_{i}\\)` | `\(a_{i}\)` | 单字符下标 |
| `\\(A_{ij}\\)` | `\(A_{ij}\)` | 多字符下标 |
| `\\(A_{i1}\\)` | `\(A_{i1}\)` | 字母数字下标 |
| `\\(x^{2}\\)`、`\\(x^{n}\\)`、`\\(x^{\alpha}\\)` | 原样 | 正常 |
| `\\(\frac{1}{2}\\)` | 原样 | 正常 |

该保护针对简单字母数字下标；复杂或嵌套的下标仍应检查最终页面输出。

### 示例

行内公式（下面这行的源码是 `\\(E = mc^2\\)`）：

质能方程 \\(E = mc^2\\) 由爱因斯坦提出。

块级公式（`$$` 独占行）：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

其他可用写法：

```markdown
环境（processEnvironments: true）
$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
$$

自定义命令（已加载 newcommand 扩展）
\\(\newcommand{\R}{\mathbb{R}} \R\\)

字面量美元符号（processEscapes: true）
价格是 \$10。
```

### 编号与引用

默认 `tags: 'none'`，公式不会自动编号，`\label` / `\ref` 也就没有编号可用。需要编号时在 `nuxt.config.ts` 中把 `tags` 改成 `'ams'`（只编号带 `\label` 的公式）或 `'all'`（全部编号）：

```ts
tags: 'ams'
```

## 旧语法迁移

`package.json` 提供了迁移脚本：

```bash
npm run convert-latex   # 等价于 node scripts/convert-to-standard-latex.mjs
```

脚本扫描 `content/**/*.md`（忽略 `node_modules`），实际支持的转换：

| 转换 | 实现 |
| --- | --- |
| `$...$` → `\(...\)` | 正则 `/(?<!\$)\$(?!\$)([^\$\n]+?)\$(?!\$)/g`：只匹配同一行、不跨行，且不会碰 `$$` |
| `\{` → `{`、`\}` → `}` | 全局替换 |
| `$$...$$` | 保持不变 |
| `\_` → `_` | 未实现（脚本中只有注释说明，直接跳过） |

使用流程：

```bash
git status                 # 先确保工作区干净
npm run convert-latex
git diff                   # 逐个文件确认转换结果
git checkout -- content/   # 有问题时回滚
```

两点注意：

1. 脚本写出的行内定界符是单反斜杠 `\(...\)`；按前面的 Markdown 转义行为，渲染后仍然到不了 MathJax，行内公式迁移后还需改成 `\\(...\\)`。
2. 脚本只做字符串替换，不做语法判断，运行后务必查看 `git diff`。

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 公式原样显示、没有排版 | 确认 CDN 脚本是否加载成功；控制台正常时打印 `MathJax rendered successfully`，出错时打印 `MathJax rendering error:` |
| 等了很久仍不渲染 | 插件最多等 10 秒，超时说明 `window.MathJax` 没有加载出来 |
| 行内公式不渲染 | 源文件里写成了 `\(`，应写 `\\(` |
| 块级公式不渲染 | 用了 `\[...\]`，应改用 `$$...$$` |
| `$x$` 不渲染 | 行内定界符只配置了 `\(...\)`，没有启用 `$...$` |
| 花括号或下标丢失 | MDC 把 `{...}` 当作属性语法删掉，见「MDC 与花括号」 |
| 切换文章后新公式没渲染 | 插件在路由变化后 500ms 重新排版；动态内容可手动调用 `$renderMathJax()` |
| 需要公式编号 | `tags` 当前是 `'none'`，改成 `'ams'` 或 `'all'` |
| 公式字体不对 | `output.font` 当前是 `mathjax-termes` |

## 相关文件

| 文件 | 作用 |
| --- | --- |
| `nuxt.config.ts` | MathJax 全局配置与 CDN 引入 |
| `app/plugins/mathjax.client.ts` | 客户端排版插件，暴露 `$renderMathJax` |
| `app/pages/blog/[...slug].vue` | 文章页挂载后触发排版 |
| `scripts/convert-to-standard-latex.mjs` | 旧语法转换脚本 |
