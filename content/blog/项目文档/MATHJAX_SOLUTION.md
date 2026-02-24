# MathJax + Nuxt Content 最佳解决方案

## 问题根源

Nuxt Content 使用 MDC (MarkDown Components) 解析器，会将 `{...}` 识别为 Vue 组件语法，导致 LaTeX 公式中的花括号被破坏。

## ❌ 不推荐的方案

### 方案1：转义花括号（当前方案）
```latex
$\frac\{1\}\{2\}$  <!-- 破坏源文件可读性 -->
```

**缺点**：
- 破坏源文件的可读性和编辑体验
- 不符合 LaTeX 标准语法
- 在其他 Markdown 编辑器中无法正常预览
- 增加编辑难度

## ✅ 推荐方案：使用标准 LaTeX 定界符

### MathJax 官方推荐的定界符

根据 [MathJax 官方文档](https://docs.mathjax.org/en/latest/options/input/tex.html)，推荐使用：

- **行内公式**：`\(...\)` 
- **块级公式**：`\[...\]` 或 `$$...$$`

这些定界符：
1. ✅ 不与 Vue/MDC 语法冲突
2. ✅ 不需要转义花括号
3. ✅ 符合 LaTeX 标准
4. ✅ 在所有 Markdown 编辑器中兼容

### 配置示例

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          innerHTML: `
            window.MathJax = {
              tex: {
                inlineMath: [['\\\\(', '\\\\)']],  // 推荐：标准 LaTeX
                displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
                processEscapes: true,
                packages: { '[+]': ['ams'] }
              },
              startup: {
                typeset: false
              }
            };
          `.trim(),
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/mathjax@4.1.1/tex-mml-chtml.js',
          async: true
        }
      ]
    }
  }
})
```

### 语法对比

| 元素 | ❌ 旧语法（需转义） | ✅ 新语法（标准） |
|------|-------------------|------------------|
| 行内公式 | `$E = mc^2$` | `\(E = mc^2\)` |
| 分数 | `$\frac\{1\}\{2\}$` | `\(\frac{1}{2}\)` |
| 上标 | `$x^\{2\}$` | `\(x^{2}\)` |
| 下标 | `$a_\{i\}$` | `\(a_{i}\)` |
| 块级公式 | `$ ... $` | `\[ ... \]` 或 `$$ ... $$` |

### 示例

#### 行内公式
```markdown
爱因斯坦的质能方程 \(E = mc^2\) 是一个著名的例子。
```

#### 块级公式
```markdown
高斯积分公式：

\[
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\]

或者使用双美元符号：

$$
e^{i\pi} + 1 = 0
$$
```

#### 复杂公式
```markdown
一元二次方程求根公式：

\[
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\]
```

## 迁移步骤

### 1. 更新 MathJax 配置

修改 `nuxt.config.ts`，移除 `$...$` 定界符（可选，但推荐）：

```typescript
inlineMath: [['\\\\(', '\\\\)']],  // 只使用标准定界符
displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
```

### 2. 批量转换现有文件

创建转换脚本 `scripts/convert-latex-delimiters.mjs`：

```javascript
import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const files = glob.sync('content/**/*.md')

files.forEach(file => {
  let content = readFileSync(file, 'utf-8')
  
  // 转换行内公式：$...$ → \(...\)
  // 注意：需要排除 $$...$$ 块级公式
  content = content.replace(/(?<!\$)\$(?!\$)([^\$\n]+?)\$(?!\$)/g, '\\\\($1\\\\)')
  
  // 移除转义的花括号：\{ → {, \} → }
  content = content.replace(/\\\{/g, '{')
  content = content.replace(/\\\}/g, '}')
  
  writeFileSync(file, content, 'utf-8')
  console.log(`✓ Converted: ${file}`)
})
```

### 3. 删除旧的转义脚本

```bash
# 删除不再需要的转义脚本
rm scripts/escape-latex-braces.mjs
rm .kiro/hooks/auto-fix-latex.kiro.hook
```

## 为什么这是最佳方案？

1. **标准化**：`\(...\)` 和 `\[...\]` 是 LaTeX 的标准定界符
2. **兼容性**：在 Obsidian、Typora、VS Code 等编辑器中都能正常预览
3. **可维护性**：源文件保持标准 LaTeX 语法，易于编辑和维护
4. **无需转义**：花括号、下划线等特殊字符都不需要转义
5. **官方推荐**：MathJax 官方文档推荐使用这些定界符

## 参考资料

- [MathJax TeX Input Processor Options](https://docs.mathjax.org/en/latest/options/input/tex.html)
- [MathJax Best Practices](https://yihui.org/en/2018/07/latex-math-markdown/)
- [Nuxt Content Configuration](https://content.nuxt.com/docs/getting-started/configuration)

## 注意事项

### processEscapes 配置

MathJax v3+ 默认 `processEscapes: true`，这意味着：
- `\$` 会被渲染为字面量 `$`
- `\\` 会被渲染为字面量 `\`

如果你需要在文本中使用美元符号，可以写 `\$10`。

### 双美元符号 $$...$$

`$$...$$` 仍然可以用于块级公式，它不会与 MDC 冲突，因为：
1. 它通常独占一行
2. MDC 不会在代码块内解析 Vue 语法
3. MathJax 会优先处理这些定界符

### Obsidian 兼容性

如果你使用 Obsidian 编辑 Markdown 文件：
- Obsidian 同时支持 `$...$` 和 `\(...\)`
- 推荐使用 `\(...\)` 以保持跨平台兼容性
- 可以在 Obsidian 设置中启用 "Strict line breaks" 以获得更好的渲染效果
