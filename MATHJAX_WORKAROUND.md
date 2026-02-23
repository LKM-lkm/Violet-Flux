# MathJax + Nuxt Content MDC 兼容性解决方案

## 问题
Nuxt Content 的 MDC 解析器会在 Markdown 解析前处理 `{...}` 语法，导致 LaTeX 公式被破坏。

## 解决方案

### 自动化方案（推荐）

已配置 Kiro Hook，当你保存 Markdown 文件时会自动转义 LaTeX 公式。

**工作原理：**
1. 检测到 `content/**/*.md` 文件保存
2. 自动运行 `scripts/escape-latex-braces.mjs`
3. 转义所有 LaTeX 公式中的花括号：`{` → `\{`，`}` → `\}`
4. 将 `\(...\)` 转换为 `$...$`
5. 将 `\[...\]` 转换为 `$$...$$`

**手动运行：**
```bash
npm run fix-latex
```

### 编写 Markdown 的注意事项

1. **使用标准界定符**：
   - 行内公式：`$...$`
   - 块级公式：`$$...$$`
   - 避免使用 `\(...\)` 和 `\[...\]`（会被自动转换）

2. **花括号会自动转义**：
   - 你写：`$A_{ij}$`
   - 保存后自动变成：`$A_\{ij\}$`
   - MathJax 正确渲染：$A_{ij}$

3. **矩阵中的换行符**：
   - 使用双反斜杠：`\\\\`
   - 示例：
     ```markdown
     $$
     \begin\{pmatrix\}
     1 & 2 \\\\
     3 & 4
     \end\{pmatrix\}
     $$
     ```

### 手动转义方法（不推荐）

如果需要手动编写，使用以下格式：

```markdown
- 单个字符：$x^2$, $a_i$
- 多个字符：$e^\{i\theta\}$, $A_\{ij\}$
- 组合使用：$R_\{ij\}^\{ab\}$
```

## 技术细节

### 为什么需要转义？

Nuxt Content 使用 MDC (Markdown Components) 解析器，它会将 `{...}` 识别为 Vue 组件语法。处理顺序：

1. MDC 解析器（破坏 LaTeX）
2. Markdown 解析器
3. MathJax 渲染（已经太晚）

### 解决方案的工作流程

```
编写 Markdown → 保存文件 → Hook 触发 → 自动转义 → MDC 解析 → MathJax 渲染 ✓
```

## 故障排除

如果公式仍然显示错误：

1. 检查 Hook 是否启用（查看 Kiro 的 Agent Hooks 面板）
2. 手动运行 `npm run fix-latex`
3. 检查浏览器控制台的 MathJax 错误
4. 确保使用 `$$...$$` 而不是 `\[...\]`

