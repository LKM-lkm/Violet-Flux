# MathJax 集成说明

## 问题背景

Nuxt Content 的 MDC 解析器会将 `{...}` 识别为 Vue 组件语法，导致 LaTeX 公式中的花括号被破坏。

例如：
- `$A_{ij}$` 会被解析成 `$A_$`
- `$R_{ij}^{ab}$` 会被解析成 `$R_^{ab}$`
- `\sqrt[3]{27}` 会被解析成 `\sqrt3{27}`

## 解决方案

### 自动化处理（已配置）

项目已配置 Kiro Hook，当你保存 `content/**/*.md` 文件时会自动：

1. 转义所有 LaTeX 公式中的花括号：`{` → `\{`，`}` → `\}`
2. 将 `\(...\)` 转换为 `$...$`
3. 将 `\[...\]` 转换为 `$$...$$`

### 使用方法

**正常编写 Markdown：**

```markdown
# 我的数学笔记

行内公式：$E = mc^2$ 和 $A_{ij}$

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

**保存文件后自动转义为：**

```markdown
# 我的数学笔记

行内公式：$E = mc^2$ 和 $A_\{ij\}$

块级公式：

$$
\int_\{-\infty\}^\{\infty\} e^\{-x^2\} dx = \sqrt\{\pi\}
$$
```

### 手动运行

如果需要批量处理所有文件：

```bash
npm run fix-latex
```

## 注意事项

1. **使用标准界定符**：
   - 行内公式：`$...$`
   - 块级公式：`$$...$$`

2. **矩阵换行符**：
   - 使用双反斜杠：`\\\\`
   - 示例：
     ```markdown
     $$
     \begin{pmatrix}
     1 & 2 \\\\
     3 & 4
     \end{pmatrix}
     $$
     ```

3. **不要手动转义**：
   - Hook 会自动处理，你只需正常编写 LaTeX
   - 保存文件后会自动转义

## 配置文件

- Hook 配置：`.kiro/hooks/auto-fix-latex.kiro.hook`
- 转义脚本：`scripts/escape-latex-braces.mjs`
- NPM 脚本：`package.json` 中的 `fix-latex`

## 故障排除

如果公式显示错误：

1. 检查浏览器控制台是否有 MathJax 错误
2. 确认 Hook 已启用（查看 Kiro 的 Agent Hooks 面板）
3. 手动运行 `npm run fix-latex`
4. 检查 `nuxt.config.ts` 中的 MathJax 配置

## 技术细节

MathJax 配置位于 `nuxt.config.ts`：

```typescript
app: {
  head: {
    script: [
      {
        innerHTML: `
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
              processEscapes: true
            }
          };
        `,
        type: 'text/javascript'
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/mathjax@4.1.1/tex-mml-chtml.js',
        async: true
      }
    ]
  }
}
```

## 参考文档

- [MathJax 官方文档](https://docs.mathjax.org/)
- [Nuxt Content 文档](https://content.nuxt.com/)
- [MDC 语法](https://content.nuxt.com/usage/markdown)
