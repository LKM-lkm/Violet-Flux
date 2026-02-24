# MathJax 官方推荐配置

## 📋 完整配置

基于 [MathJax 官方文档](https://docs.mathjax.org/en/latest/options/input/tex.html) 的推荐配置。

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          innerHTML: `
            window.MathJax = {
              loader: { 
                load: ['[tex]/ams', '[tex]/newcommand', '[tex]/configmacros'] 
              },
              tex: {
                // 扩展包
                packages: ['base', 'ams', 'newcommand', 'configmacros'],
                
                // 定界符配置
                inlineMath: [['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                
                // 处理选项
                processEscapes: true,       // 使用 \\$ 表示字面量美元符号
                processEnvironments: true,  // 处理 \\begin{xxx}...\\end{xxx}
                processRefs: true,          // 处理 \\ref{...} 引用
                
                // 数字和标识符模式
                numberPattern: /^(?:[0-9]+(?:\\{,\\}[0-9]{3})*(?:\\.[0-9]*)?|\\.[0-9]+)/,
                initialDigit: /[0-9.,]/,
                identifierPattern: /^[a-zA-Z]+/,
                initialLetter: /[a-zA-Z]/,
                
                // 标签和编号
                tags: 'none',               // 'none', 'ams', 或 'all'
                tagSide: 'right',           // 标签位置：'left' 或 'right'
                tagIndent: '0.8em',         // 标签缩进
                tagAlign: 'baseline',       // 标签对齐方式
                useLabelIds: true,          // 使用标签名而非标签号作为 id
                ignoreDuplicateLabels: false, // 是否忽略重复标签错误
                
                // 样式
                mathStyle: 'TeX',           // 'TeX', 'ISO', 'French', 或 'upright'
                
                // 性能限制
                maxBuffer: 5 * 1024,        // 内部 TeX 字符串最大大小 (5KB)
                maxTemplateSubtitutions: 10000, // 最大模板替换次数
                
                // 基础 URL（用于标签链接）
                baseURL: (document.getElementsByTagName('base').length === 0) 
                  ? '' 
                  : String(document.location).replace(/#.*$/, ''),
                
                // 错误处理
                formatError: (jax, err) => jax.formatError(err),
                
                // 过滤器
                preFilters: [],             // 预处理过滤器
                postFilters: []             // 后处理过滤器
              },
              output: {
                font: 'mathjax-termes'      // 使用 Termes 字体
              },
              startup: {
                typeset: false              // 不自动排版，由页面控制
              }
            };
          `.trim(),
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/mathjax@4.1.1/tex-mml-chtml.js',
          id: 'MathJax-script',
          async: true
        }
      ]
    }
  }
})
```

## 📖 配置详解

### 1. 扩展包（packages）

```javascript
packages: ['base', 'ams', 'newcommand', 'configmacros']
```

- **base** - 基础 TeX 支持
- **ams** - AMS 数学扩展（矩阵、对齐、多行公式等）
- **newcommand** - 支持 `\newcommand` 自定义命令
- **configmacros** - 配置宏支持

### 2. 定界符（Delimiters）

```javascript
inlineMath: [['\\(', '\\)']],
displayMath: [['$$', '$$'], ['\\[', '\\]']]
```

- **行内公式**：`\(...\)` 
- **块级公式**：`$$...$$` 或 `\[...\]`

**为什么使用 `\\(` 而不是 `$`？**
- 避免与 Markdown 和 Vue 语法冲突
- 符合 LaTeX 标准
- 不需要转义花括号

### 3. 处理选项

#### processEscapes: true

允许使用转义字符：
- `\$` → 字面量 `$`
- `\\` → 字面量 `\`

示例：
```markdown
价格是 \$10，不是数学公式。
```

#### processEnvironments: true

处理数学环境：
```latex
\begin{matrix}
a & b \\
c & d
\end{matrix}
```

#### processRefs: true

处理交叉引用：
```latex
\label{eq:pythagorean}
a^2 + b^2 = c^2

参考公式 \ref{eq:pythagorean}
```

### 4. 标签和编号

#### tags 选项

- **'none'** - 不自动编号（默认）
- **'ams'** - AMS 样式编号（只编号有 `\label` 的公式）
- **'all'** - 所有公式都编号

示例：
```javascript
tags: 'ams'  // 启用 AMS 编号
```

```latex
\begin{equation}
\label{eq:einstein}
E = mc^2
\end{equation}

这是爱因斯坦方程 \eqref{eq:einstein}
```

#### tagSide 和 tagIndent

```javascript
tagSide: 'right',    // 标签显示在右侧
tagIndent: '0.8em'   // 标签缩进 0.8em
```

### 5. 数学样式（mathStyle）

```javascript
mathStyle: 'TeX'  // 'TeX', 'ISO', 'French', 或 'upright'
```

- **TeX** - 传统 TeX 样式（变量斜体，函数正体）
- **ISO** - ISO 标准样式
- **French** - 法国数学样式
- **upright** - 全部正体

### 6. 性能限制

```javascript
maxBuffer: 5 * 1024,              // 5KB
maxTemplateSubtitutions: 10000    // 10000 次
```

防止过大或过复杂的公式导致性能问题。

### 7. 错误处理

```javascript
formatError: (jax, err) => jax.formatError(err)
```

自定义错误格式化函数，可以用于：
- 记录错误日志
- 显示友好的错误消息
- 调试 LaTeX 语法问题

## 🎯 常用配置场景

### 场景 1：基础博客（当前配置）

```javascript
{
  packages: ['base', 'ams'],
  inlineMath: [['\\(', '\\)']],
  displayMath: [['$$', '$$'], ['\\[', '\\]']],
  processEscapes: true,
  tags: 'none'
}
```

### 场景 2：学术论文

```javascript
{
  packages: ['base', 'ams', 'newcommand', 'configmacros'],
  inlineMath: [['\\(', '\\)']],
  displayMath: [['\\[', '\\]']],
  processEscapes: true,
  processRefs: true,
  tags: 'ams',              // 启用公式编号
  tagSide: 'right',
  useLabelIds: true
}
```

### 场景 3：教学文档

```javascript
{
  packages: ['base', 'ams', 'color', 'bbox'],
  inlineMath: [['\\(', '\\)']],
  displayMath: [['$$', '$$']],
  processEscapes: true,
  tags: 'all',              // 所有公式都编号
  mathStyle: 'TeX'
}
```

## 🔧 高级功能

### 自定义宏

```javascript
tex: {
  macros: {
    RR: "\\mathbb{R}",
    bold: ["\\mathbf{#1}", 1],
    red: ["\\color{red}{#1}", 1]
  }
}
```

使用：
```latex
\(x \in \RR\)
\(\bold{v} = (1, 2, 3)\)
\(\red{重要公式}\)
```

### 自定义环境

```javascript
tex: {
  environments: {
    braced: ["\\left\\{\\begin{array}{@{}l@{}}#1\\end{array}\\right.", null]
  }
}
```

### 过滤器

```javascript
tex: {
  preFilters: [
    (math) => {
      // 预处理 LaTeX 代码
      return math.replace(/mycommand/g, '\\mycommand')
    }
  ],
  postFilters: [
    (math) => {
      // 后处理 LaTeX 代码
      return math
    }
  ]
}
```

## 📚 参考资料

- [MathJax TeX Input Options](https://docs.mathjax.org/en/latest/options/input/tex.html)
- [MathJax Configuration](https://docs.mathjax.org/en/latest/web/configuration.html)
- [TeX and LaTeX Support](https://docs.mathjax.org/en/latest/input/tex/index.html)
- [MathJax Extensions](https://docs.mathjax.org/en/latest/input/tex/extensions.html)

## 💡 最佳实践

1. **使用标准定界符** - `\(...\)` 和 `\[...\]`
2. **启用 processEscapes** - 方便处理特殊字符
3. **按需加载扩展** - 只加载需要的包
4. **设置性能限制** - 防止过大公式
5. **自定义错误处理** - 便于调试

## ⚠️ 注意事项

### 1. 双反斜杠

在 JavaScript 字符串中，反斜杠需要转义：
```javascript
inlineMath: [['\\\\(', '\\\\)']]  // 正确
inlineMath: [['\\(', '\\)']]      // 错误
```

### 2. 性能考虑

- 大型文档建议增加 `maxBuffer`
- 复杂公式建议增加 `maxTemplateSubtitutions`

### 3. 兼容性

- MathJax v4 与 v3 配置略有不同
- 某些扩展可能需要额外加载

---

**当前配置已采用官方推荐设置，可以直接使用！** ✅
